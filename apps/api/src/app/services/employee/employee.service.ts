import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { Client, Employe } from '@prisma/client';
import { RESPONSES } from './constants/responses';

@Injectable()
export class EmployeeService {
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
    if (!user) throw new BadRequestException(RESPONSES.EMPLOYEE_NOT_FOUND);
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
    if (!user) throw new BadRequestException(RESPONSES.EMPLOYEE_NOT_FOUND);
    return this.prisma.employe.update({
      where: {
        id: id,
        clientId: client.id,
      },
      data: {
        ...body,
        clientId: client.id,
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
      throw new BadRequestException(RESPONSES.EMPLOYEE_ALREADY_EXISTS);

    return this.prisma.employe.create({
      data: {
        ...body,
        clientId: client.id,
      },
    });
  }
}
