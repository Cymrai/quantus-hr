import { Module } from '@nestjs/common';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { RouterModule } from 'nest-router';
import employeeRoutes from './routes/employee.routes';

@Module({
  imports: [RouterModule.forRoutes(employeeRoutes)],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
})
export class EmployeesModule {}