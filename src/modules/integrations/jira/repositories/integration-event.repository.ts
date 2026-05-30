import { EntityRepository, Repository } from 'typeorm';
import { IntegrationEvent } from '../../shared/types/integration-event.type';

@EntityRepository(IntegrationEvent)
export class IntegrationEventRepository extends Repository<IntegrationEvent> {}