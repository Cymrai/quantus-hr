import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum PlanTier {
  STARTER = 'starter',
  GROWTH = 'growth',
  ENTERPRISE = 'enterprise',
}

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) slug: string;
  @Column() name: string;
  @Column({ nullable: true }) industry: string;
  @Column({ type: 'enum', enum: PlanTier, default: PlanTier.STARTER }) plan: PlanTier;
  @Column({ default: true }) isActive: boolean;
  @Column({ type: 'jsonb', nullable: true }) settings: Record<string, unknown>;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
