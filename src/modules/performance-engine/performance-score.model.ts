import { Model, Table, Column, DataType, PrimaryKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'performance_scores', timestamps: false })
export class PerformanceScore extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  tenant_id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  employee_id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  model_type: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  model_version: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  score: number;

  @Column({ type: DataType.DATE, allowNull: false })
  period_start: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  period_end: Date;

  @CreatedAt
  @Column({ type: DataType.DATE })
  calculated_at: Date;

  @Column({ type: DataType.JSONB, allowNull: false })
  input_snapshot: object;
}