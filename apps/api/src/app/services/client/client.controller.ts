import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Client, TimeSheet } from '@prisma/client';
import { CurrentClient } from '../auth/decorators/client.decorator';
import { JwtClientGuard } from '../auth/guards/client.guard';
import { ClientService } from './client.service';

@UseGuards(JwtClientGuard)
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // This method is used to get the timesheets for the client. It returns the timesheets.
  @Get('timesheets')
  async getTimesheets(@CurrentClient() client: Client): Promise<TimeSheet[]> {
    return await this.clientService.getTimesheets(client);
  }

  // This method is used to create a timesheet for the client. It returns the timesheet.
  @Post('timesheet/create')
  async createTimesheet(
    @Body() data: [number],
    @CurrentClient() client: Client,
  ) {
    return await this.clientService.createTimesheet(data, client);
  }
}
