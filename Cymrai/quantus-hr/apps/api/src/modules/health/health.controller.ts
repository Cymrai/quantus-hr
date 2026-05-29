/**
 * @file health.controller.ts
 * @description Controller for handling health check routes, including liveness and readiness probes.
 */
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  async check() {
    return this.health.check([async () => this.db.pingCheck('database')]);
  }
}