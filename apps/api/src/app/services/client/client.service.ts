import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { Client, Employe } from '@prisma/client';
import { JwtPayloadInterface } from '../auth/interfaces/jwtPayload.interface';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  // This method is used to get all the employees from the database. It returns an array of employees.
  async getEmployees(client: Client): Promise<Employe[]> {
    return this.prisma.employe.findMany({
      where: {
        clientId: client.id,
      },
    });
  }

  // This method is used to get an employee from the database with ID. It returns the employee.
  async getEmployee(id: number, client: Client): Promise<Employe> {
    const user = await this.prisma.employe.findUnique({
      where: {
        id: id,
        clientId: client.id,
      },
    });
    if (!user)
      throw new BadRequestException(
        'Employee not found, please select another ID',
      );
    return user;
  }

  // This method is used to update an employee in the database. It returns the updated employee. If the employee does not exist, it throws an error.
  async updateEmployee(
    id: number,
    body: Employe,
    client: Client,
  ): Promise<Employe> {
    const user = await this.prisma.employe.findUnique({
      where: {
        id: id,
        clientId: client.id,
      },
    });
    if (!user)
      throw new BadRequestException(
        'Employee not found, please select another ID',
      );
    return this.prisma.employe.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });
  }

  // This method is used to create a new employee in the database. It returns the created employee. If the employee already exists, it throws an error.
  async createEmployee(body: Employe, client: Client): Promise<Employe> {
    const userExist = await this.prisma.employe.findFirst({
      where: {
        name: body.name,
        clientId: client.id,
      },
    });
    if (userExist)
      throw new BadRequestException(
        'Employee already exist, please select another name',
      );

    return this.prisma.employe.create({
      data: {
        ...body,
      },
    });
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
