import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Client, Employe } from '@prisma/client';
import { CurrentClient } from '../auth/decorators/client.decorator';
import { JwtClientGuard } from '../auth/guards/client.guard';
import { EmployeeService } from './employee.service';

@UseGuards(JwtClientGuard)
@Controller('client')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // This endpoint is used to get all the employees from the database.
  @Get('employees')
  async getEmployees(@CurrentClient() client: Client): Promise<Employe[]> {
    return this.employeeService.getEmployees(client);
  }

  // This endpoint is used to get an employee from the database with ID.
  @Get('employee/:id')
  async getEmployee(
    @Param('id') id: number,
    @CurrentClient() client: Client,
  ): Promise<Employe> {
    return this.employeeService.getEmployee(Number(id), client);
  }

  // This endpoint is used to update an employee in the database. It returns the updated employee.
  @Put('update/employee/:id')
  async updateEmployee(
    @Param('id') id: number,
    @Body() body: Employe,
    @CurrentClient() client: Client,
  ): Promise<Employe> {
    return this.employeeService.updateEmployee(Number(id), body, client);
  }

  // This endpoint is used to create a new employee in the database.
  @Post('create/employee')
  async createEmployee(
    @Body() body: Employe,
    @CurrentClient() client: Client,
  ): Promise<Employe> {
    return this.employeeService.createEmployee(body, client);
  }
}
