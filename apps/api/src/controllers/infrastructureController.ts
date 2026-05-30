import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Instantiate clients after env is loaded; region set via AWS_REGION env var.
const region = process.env.AWS_REGION ?? 'us-west-2';
const ec2 = new AWS.EC2({ region });
const ecs = new AWS.ECS({ region });
const rds = new AWS.RDS({ region });
const elasticache = new AWS.ElastiCache({ region });
const s3 = new AWS.S3({ region });
const secretsManager = new AWS.SecretsManager({ region });

/** Generate a cryptographically secure random password. */
function generateSecurePassword(length = 32): string {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/[+/=]/g, '')
    .slice(0, length);
}

/**
 * @route POST /api/infrastructure/provision
 * @description Provision AWS baseline infrastructure including ECS, RDS, ElastiCache, and S3.
 * @access Private — requires valid JWT + admin role (enforced in router)
 */
export const provisionInfrastructure = async (req: Request, res: Response) => {
  // Single run ID used across all resource names/tags for correlation
  const runId = uuidv4();

  // Track created resources for rollback on partial failure
  const created: {
    vpcId?: string;
    publicSubnetId?: string;
    privateSubnetId?: string;
    clusterArn?: string;
    dbInstanceId?: string;
    cacheClusterId?: string;
    bucketName?: string;
    secretName?: string;
  } = {};

  try {
    // 1. VPC
    const vpc = await ec2
      .createVpc({
        CidrBlock: '10.0.0.0/16',
        InstanceTenancy: 'default',
        TagSpecifications: [
          {
            ResourceType: 'vpc',
            Tags: [{ Key: 'Name', Value: `quantus-hr-vpc-${runId}` }],
          },
        ],
      })
      .promise();
    created.vpcId = vpc.Vpc!.VpcId;

    // 2. Public subnet
    const publicSubnet = await ec2
      .createSubnet({
        VpcId: created.vpcId!,
        CidrBlock: '10.0.1.0/24',
        AvailabilityZone: `${region}a`,
        TagSpecifications: [
          {
            ResourceType: 'subnet',
            Tags: [{ Key: 'Name', Value: `quantus-hr-public-subnet-${runId}` }],
          },
        ],
      })
      .promise();
    created.publicSubnetId = publicSubnet.Subnet!.SubnetId;

    // 3. Private subnet (separate params — don't mutate publicSubnet params)
    const privateSubnet = await ec2
      .createSubnet({
        VpcId: created.vpcId!,
        CidrBlock: '10.0.2.0/24',
        AvailabilityZone: `${region}b`,
        TagSpecifications: [
          {
            ResourceType: 'subnet',
            Tags: [{ Key: 'Name', Value: `quantus-hr-private-subnet-${runId}` }],
          },
        ],
      })
      .promise();
    created.privateSubnetId = privateSubnet.Subnet!.SubnetId;

    // 4. ECS cluster (VPC association is at service/task level, not cluster level)
    const cluster = await ecs
      .createCluster({ clusterName: `quantus-hr-cluster-${runId}` })
      .promise();
    created.clusterArn = cluster.cluster!.clusterArn;

    // 5. RDS — credentials generated server-side, never from request body
    const dbPassword = generateSecurePassword();
    const dbInstanceId = `quantus-hr-db-${runId}`;
    await rds
      .createDBInstance({
        DBInstanceIdentifier: dbInstanceId,
        DBInstanceClass: process.env.RDS_INSTANCE_CLASS ?? 'db.t3.micro',
        Engine: 'postgres',
        MasterUsername: process.env.RDS_MASTER_USERNAME ?? 'qhradmin',
        MasterUserPassword: dbPassword,
        AllocatedStorage: 20,
        VpcSecurityGroupIds: (process.env.RDS_SECURITY_GROUP_IDS ?? '').split(',').filter(Boolean),
        DBSubnetGroupName: process.env.RDS_SUBNET_GROUP_NAME,
        Tags: [{ Key: 'Name', Value: `quantus-hr-rds-${runId}` }],
      })
      .promise();
    created.dbInstanceId = dbInstanceId;

    // 6. ElastiCache Redis
    const cacheClusterId = `quantus-hr-cache-${runId.slice(0, 8)}`; // max 20 chars
    await elasticache
      .createCacheCluster({
        CacheClusterId: cacheClusterId,
        Engine: 'redis',
        CacheNodeType: process.env.CACHE_NODE_TYPE ?? 'cache.t3.micro',
        NumCacheNodes: 1,
        SecurityGroupIds: (process.env.CACHE_SECURITY_GROUP_IDS ?? '').split(',').filter(Boolean),
      })
      .promise();
    created.cacheClusterId = cacheClusterId;

    // 7. S3 bucket — private, with explicit public access block + SSE
    const bucketName = `quantus-hr-uploads-${runId}`;
    await s3.createBucket({ Bucket: bucketName }).promise();
    created.bucketName = bucketName;

    await Promise.all([
      s3
        .putPublicAccessBlock({
          Bucket: bucketName,
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            IgnorePublicAcls: true,
            BlockPublicPolicy: true,
            RestrictPublicBuckets: true,
          },
        })
        .promise(),
      s3
        .putBucketEncryption({
          Bucket: bucketName,
          ServerSideEncryptionConfiguration: {
            Rules: [
              {
                ApplyServerSideEncryptionByDefault: {
                  SSEAlgorithm: 'AES256',
                },
              },
            ],
          },
        })
        .promise(),
      s3
        .putBucketVersioning({
          Bucket: bucketName,
          VersioningConfiguration: { Status: 'Enabled' },
        })
        .promise(),
    ]);

    // 8. Secrets Manager — store all connection info under one secret
    const secretName = `quantus-hr-secrets-${runId}`;
    await secretsManager
      .createSecret({
        Name: secretName,
        SecretString: JSON.stringify({
          RDS_INSTANCE_ID: dbInstanceId,
          RDS_MASTER_USERNAME: process.env.RDS_MASTER_USERNAME ?? 'qhradmin',
          RDS_MASTER_PASSWORD: dbPassword,
          CACHE_CLUSTER_ID: cacheClusterId,
          S3_BUCKET: bucketName,
          RUN_ID: runId,
        }),
      })
      .promise();
    created.secretName = secretName;

    res.status(201).json({
      message: 'Infrastructure provisioned successfully',
      runId,
      resources: {
        vpcId: created.vpcId,
        clusterArn: created.clusterArn,
        dbInstanceId: created.dbInstanceId,
        cacheClusterId: created.cacheClusterId,
        s3Bucket: created.bucketName,
        secretName: created.secretName,
      },
    });
  } catch (error: any) {
    // Attempt rollback of already-created resources
    await rollback(created);

    const statusCode =
      error.code === 'ResourceAlreadyExistsException' ? 409 : 500;
    res.status(statusCode).json({
      error: 'Infrastructure provisioning failed',
      code: error.code ?? 'UNKNOWN',
    });
  }
};

async function rollback(created: {
  vpcId?: string;
  publicSubnetId?: string;
  privateSubnetId?: string;
  clusterArn?: string;
  dbInstanceId?: string;
  cacheClusterId?: string;
  bucketName?: string;
  secretName?: string;
}) {
  const region = process.env.AWS_REGION ?? 'us-west-2';
  const ec2c = new AWS.EC2({ region });
  const ecsc = new AWS.ECS({ region });
  const rdsc = new AWS.RDS({ region });
  const elasticachec = new AWS.ElastiCache({ region });
  const s3c = new AWS.S3({ region });
  const smc = new AWS.SecretsManager({ region });

  const tasks: Promise<any>[] = [];

  if (created.secretName)
    tasks.push(
      smc.deleteSecret({ SecretId: created.secretName, ForceDeleteWithoutRecovery: true }).promise().catch(() => {}),
    );
  if (created.bucketName)
    tasks.push(
      s3c.deleteBucket({ Bucket: created.bucketName }).promise().catch(() => {}),
    );
  if (created.cacheClusterId)
    tasks.push(
      elasticachec.deleteCacheCluster({ CacheClusterId: created.cacheClusterId }).promise().catch(() => {}),
    );
  if (created.dbInstanceId)
    tasks.push(
      rdsc.deleteDBInstance({ DBInstanceIdentifier: created.dbInstanceId, SkipFinalSnapshot: true }).promise().catch(() => {}),
    );
  if (created.clusterArn)
    tasks.push(
      ecsc.deleteCluster({ cluster: created.clusterArn }).promise().catch(() => {}),
    );
  if (created.privateSubnetId)
    tasks.push(
      ec2c.deleteSubnet({ SubnetId: created.privateSubnetId }).promise().catch(() => {}),
    );
  if (created.publicSubnetId)
    tasks.push(
      ec2c.deleteSubnet({ SubnetId: created.publicSubnetId }).promise().catch(() => {}),
    );
  if (created.vpcId)
    tasks.push(
      ec2c.deleteVpc({ VpcId: created.vpcId }).promise().catch(() => {}),
    );

  await Promise.all(tasks);
}
