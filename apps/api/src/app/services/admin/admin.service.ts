import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { Status, TimeSheet } from '@prisma/client';
import { RESPONSES } from './constants/responses';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // This method is used to get all the timesheets for the admin. It returns the timesheets.
  async getTimesheets(): Promise<TimeSheet[]> {
    const timesheets = await this.prisma.timeSheet.findMany({
      include: {
        employees: true,
        client: true,
      },
    });
    return timesheets;
  }

  // This method is used to get a timesheet for the admin. It returns the timesheet.
  async getTimesheet(id: number): Promise<TimeSheet> {
    const timesheet = await this.prisma.timeSheet.findUnique({
      where: {
        id: id,
      },
      include: {
        employees: true,
        client: true,
      },
    });
    if (!timesheet)
      throw new BadRequestException(RESPONSES.TIMESHEET_NOT_FOUND);
    return timesheet;
  }

  // This method is used to update a timesheet for the admin. It returns the timesheet.
  async updateTimesheet(
    id: number,
    body: { note: string; status: Status },
  ): Promise<TimeSheet> {
    const timesheet = await this.prisma.timeSheet.update({
      where: {
        id: id,
      },
      data: {
        note: body.note,
        status: body.status,
      },
    });
    if (!timesheet)
      throw new BadRequestException(RESPONSES.TIMESHEET_NOT_FOUND);
    return timesheet;
  }
}
