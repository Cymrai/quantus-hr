import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

export enum PerformanceModel {
  OUTPUT = 'output',
  TIME = 'time',
  OKR = 'okr',
  MILESTONE = 'milestone',
  CUSTOM = 'custom',
}

export enum EmploymentStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() organizationId: string;
  @Column({ nullable: true }) teamId: string;
  @Column({ nullable: true }) managerId: string;
  @Column({ nullable: true }) jobTitle: string;
  @Column({ nullable: true }) department: string;
  @Column({ type: 'enum', enum: PerformanceModel, default: PerformanceModel.OUTPUT }) performanceModel: PerformanceModel;
  @Column({ type: 'enum', enum: EmploymentStatus, default: EmploymentStatus.ACTIVE }) status: EmploymentStatus;
  @Column({ type: 'date', nullable: true }) startDate: Date;
  @Column({ type: 'jsonb', nullable: true }) performanceConfig: Record<string, unknown>;
  @Column({ type: 'jsonb', nullable: true }) metadata: Record<string, unknown>;
  @ManyToOne(() => Organization) @JoinColumn({ name: 'organizationId' }) organization: Organization;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
