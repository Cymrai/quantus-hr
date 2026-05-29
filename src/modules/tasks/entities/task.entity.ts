import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column({ nullable: true })
  assignee_id?: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ['todo', 'in_progress', 'done'], default: 'todo' })
  status: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 1.0 })
  qualityWeight: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 1.0 })
  complexityMultiplier: number;

  @Column({ nullable: true })
  externalRef?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}