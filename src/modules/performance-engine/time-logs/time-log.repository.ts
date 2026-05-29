import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TimeLog } from './time-log.model';

@Injectable()
export class TimeLogRepository {
  constructor(@InjectModel(TimeLog) private timeLogModel: typeof TimeLog) {}

  async findByEmployeeAndPeriod(employeeId: string, periodStart: Date, periodEnd: Date): Promise<TimeLog[]> {
    return this.timeLogModel.findAll({ where: { employee_id: employeeId, date: { [Sequelize.Op.between]: [periodStart, periodEnd] } } });
  }
}