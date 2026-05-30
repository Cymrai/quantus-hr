// [CRITICAL] The original file mixed a NestJS @Module declaration with plain
//   Express classes that are never managed by NestJS DI.  The Express Router
//   file and `nest-router` import have been removed.  The controller and service
//   are now proper NestJS-decorated classes (see their respective files) so the
//   DI container can manage them correctly.
//
//   If the project intends to stay with plain Express, remove this file entirely
//   and wire the router into the Express app directly.
import { Module } from '@nestjs/common';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './repositories/employee.repository';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
})
export class EmployeesModule {}
