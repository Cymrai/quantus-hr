import { EntityRepository, Repository } from 'typeorm';
import { TimeLog } from '../entities/time-log.entity';

@EntityRepository(TimeLog)
export class TimeLogRepository extends Repository<TimeLog> {}