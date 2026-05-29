import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  Admin = 'admin',
  Manager = 'manager',
  Employee = 'employee',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Role, default: Role.Employee })
  role: Role;

  // other fields...
}