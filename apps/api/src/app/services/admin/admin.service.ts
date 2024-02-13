import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { Status, TimeSheet } from '@prisma/client';

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
    try {
      const timesheet = await this.prisma.timeSheet.findUnique({
        where: {
          id: id,
        },
        include: {
          employees: true,
          client: true,
        },
      });
      return timesheet;
    } catch (error) {
      throw new BadRequestException(
        'Timesheet not found, please check the ID.',
      );
    }
  }

  // This method is used to update a timesheet for the admin. It returns the timesheet.
  async updateTimesheet(
    id: number,
    body: { note: string; status: Status },
  ): Promise<TimeSheet> {
    try {
      const timesheet = await this.prisma.timeSheet.update({
        where: {
          id: id,
        },
        data: {
          note: body.note,
          status: body.status,
        },
      });
      return timesheet;
    } catch (error) {
      throw new BadRequestException(
        'Timesheet not found, please check the ID.',
      );
    }
  }
}
