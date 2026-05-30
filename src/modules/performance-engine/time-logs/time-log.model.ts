import { Model, Table, Column, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'time_logs' })
export class TimeLog extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  employee_id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.FLOAT, allowNull: false })
  hours: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_billable: boolean;
}