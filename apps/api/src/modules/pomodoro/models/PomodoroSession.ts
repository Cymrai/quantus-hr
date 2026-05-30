import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/database';

export class PomodoroSession extends Model {}

PomodoroSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'idle',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PomodoroSession',
    tableName: 'pomodoro_sessions',
    timestamps: true,
  }
);