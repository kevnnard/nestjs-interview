import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Status, TimeSheet } from '@prisma/client';
import { JwtAdminGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';

@UseGuards(JwtAdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  // This endpoint is used to get all the timesheets for the admin. It returns the timesheets.
  @Get('timesheets')
  async getAllTimesheets(): Promise<TimeSheet[]> {
    return await this.admin.getTimesheets();
  }

  // This endpoint is used to get a timesheet for the admin. It returns the timesheet.
  @Get('timesheet/:id')
  async getTimesheet(@Param('id') id: number): Promise<TimeSheet> {
    return await this.admin.getTimesheet(Number(id));
  }

  // This endpoint is used to update a timesheet for the admin. It returns the timesheet.
  @Put('timesheet/:id')
  async updateTimesheet(
    @Param('id') id: number,
    @Body() body: { note: string; status: Status },
  ): Promise<TimeSheet> {
    return await this.admin.updateTimesheet(Number(id), body);
  }
}
