import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ORG_ADMIN = 'org_admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() @Exclude() password: string;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE }) role: UserRole;
  @Column({ nullable: true }) organizationId: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
