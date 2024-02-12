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
import { ClientService } from './client.service';

@UseGuards(JwtClientGuard)
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // This endpoint is used to get all the employees from the database.
  @Get('employees')
  async getEmployees(@CurrentClient() client: Client): Promise<Employe[]> {
    return this.clientService.getEmployees(client);
  }

  // This endpoint is used to get an employee from the database with ID.
  @Get('employee/:id')
  async getEmployee(
    @Param('id') id: number,
    @CurrentClient() client: Client,
  ): Promise<Employe> {
    return this.clientService.getEmployee(Number(id), client);
  }

  // This endpoint is used to update an employee in the database. It returns the updated employee.
  @Put('update/employee/:id')
  async updateEmployee(
    @Param('id') id: number,
    @Body() body: Employe,
    @CurrentClient() client: Client,
  ): Promise<Employe> {
    return this.clientService.updateEmployee(Number(id), body, client);
  }

  // This endpoint is used to create a new employee in the database.
  @Post('create/employee')
  async createEmployee(
    @Body() body: Employe,
    @CurrentClient() client: Client,
  ): Promise<Employe> {
    return this.clientService.createEmployee(body, client);
  }
}
