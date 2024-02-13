import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { Client, Employe } from '@prisma/client';
import { JwtPayloadInterface } from '../auth/interfaces/jwtPayload.interface';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  // This method is used to get the timesheets for the client. It returns the timesheets.
  async getTimesheets(client: Client) {
    const timesheets = await this.prisma.timeSheet.findMany({
      include: {
        employees: true,
      },
      where: {
        clientId: client.id,
      },
    });
    return timesheets;
  }

  // This method is used to create a timesheet for the client. It returns the timesheet.
  async createTimesheet(data: any, clientt: Client) {
    try {
      const timesheet = await this.prisma.timeSheet.create({
        data: {
          clientId: clientt.id,
          employees: {
            connect: data.employees.map((employee: Employe) => {
              return {
                id: employee,
              };
            }),
          },
        },
      });

      return timesheet;
    } catch (error) {
      throw new BadRequestException(
        'Timesheet not created, please select employees and try again',
      );
    }
  }

  // This method is used to validate the user payload from the JWT token and emit an event to validate the user in the system. It returns the payload.
  async validateClient(payload: JwtPayloadInterface) {
    const user = await this.prisma.client.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (user) return user;
  }
}
