import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { EmployeeService } from '@ocmi/api/app/services/employee/employee.service';
import { Client, Employe, PaymentType } from '@prisma/client';

describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeService, PrismaService],
    }).compile();

    employeeService = module.get<EmployeeService>(EmployeeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Mocking Data
  const client: Client = {
    id: 1,
    name: 'John Doe',
    email: 'example@exmaple.com',
    password: 'Example',
    company: 'Example',
    createdAt: new Date(),
  };
  const expectedEmployees: Employe[] = [
    {
      id: 1,
      name: 'John Doe',
      paymentType: 'HOURLY' as PaymentType,
      paymentHour: 20,
      paymentAmount: 12,
      clientId: 1,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'John Doe 2',
      paymentType: 'SALARY' as PaymentType,
      paymentHour: 0,
      paymentAmount: 480,
      clientId: 2,
      createdAt: new Date(),
    },
  ];
  const body: Employe = {
    id: 1,
    name: 'John Doe',
    paymentType: 'HOURLY' as PaymentType,
    paymentHour: 20,
    paymentAmount: 12,
    clientId: 1,
    createdAt: new Date(),
  };
  // * End of Mocking Data

  // Test Cases for Employee Service Methods
  describe('getEmployees', () => {
    it('should return an array of employees', async () => {
      jest
        .spyOn(prismaService.employe, 'findMany')
        .mockResolvedValue(expectedEmployees);

      const result = await employeeService.getEmployees(client);

      expect(result).toEqual(expectedEmployees);
      expect(prismaService.employe.findMany).toHaveBeenCalledWith({
        where: {
          clientId: client.id,
        },
      });
    });
  });

  describe('getEmployee', () => {
    it('should return the employee with the given ID', async () => {
      const id = 1;

      jest
        .spyOn(prismaService.employe, 'findUnique')
        .mockResolvedValue(expectedEmployees[0]);

      const result = await employeeService.getEmployee(id, client);

      expect(result).toEqual(expectedEmployees[0]);
      expect(prismaService.employe.findUnique).toHaveBeenCalledWith({
        where: {
          id: id,
          clientId: client.id,
        },
      });
    });

    it('should throw BadRequestException if employee is not found', async () => {
      const id = 10;

      jest.spyOn(prismaService.employe, 'findUnique').mockResolvedValue(null);

      await expect(employeeService.getEmployee(id, client)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaService.employe.findUnique).toHaveBeenCalledWith({
        where: {
          id: id,
          clientId: client.id,
        },
      });
    });
  });

  describe('updateEmployee', () => {
    it('should update the employee with the given ID and return the updated employee', async () => {
      const id = 1;
      const expectedUpdatedEmployee: Employe = {
        id: 1,
        name: 'John Doe Smith',
        paymentType: 'HOURLY' as PaymentType,
        paymentHour: 20,
        paymentAmount: 13,
        clientId: 1,
        createdAt: new Date(),
      };

      jest
        .spyOn(prismaService.employe, 'findUnique')
        .mockResolvedValue(expectedUpdatedEmployee);
      jest
        .spyOn(prismaService.employe, 'update')
        .mockResolvedValue(expectedUpdatedEmployee);

      const result = await employeeService.updateEmployee(id, body, client);

      expect(result).toEqual(expectedUpdatedEmployee);
      expect(prismaService.employe.findUnique).toHaveBeenCalledWith({
        where: {
          id: id,
          clientId: client.id,
        },
      });
      expect(prismaService.employe.update).toHaveBeenCalledWith({
        where: {
          clientId: client.id,
          id: id,
        },
        data: {
          ...body,
        },
      });
    });

    it('should throw BadRequestException if employee is not found', async () => {
      const id = 10;

      jest.spyOn(prismaService.employe, 'findUnique').mockResolvedValue(null);

      await expect(
        employeeService.updateEmployee(id, body, client),
      ).rejects.toThrow(BadRequestException);
      expect(prismaService.employe.findUnique).toHaveBeenCalledWith({
        where: {
          id: id,
          clientId: client.id,
        },
      });
    });
  });

  describe('createEmployee', () => {
    it('should create a new employee and return the created employee', async () => {
      const expectedCreatedEmployee: Employe = {
        id: 1,
        name: 'John Doe Smith',
        paymentType: 'HOURLY' as PaymentType,
        paymentHour: 20,
        paymentAmount: 14,
        clientId: 1,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.employe, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prismaService.employe, 'create')
        .mockResolvedValue(expectedCreatedEmployee);

      const result = await employeeService.createEmployee(body, client);

      expect(result).toEqual(expectedCreatedEmployee);
      expect(prismaService.employe.findFirst).toHaveBeenCalledWith({
        where: {
          name: body.name,
          clientId: client.id,
        },
      });
      expect(prismaService.employe.create).toHaveBeenCalledWith({
        data: {
          ...body,
        },
      });
    });

    it('should throw BadRequestException if employee already exists', async () => {
      jest.spyOn(prismaService.employe, 'findFirst').mockResolvedValue(body);

      await expect(
        employeeService.createEmployee(body, client),
      ).rejects.toThrow(BadRequestException);
      expect(prismaService.employe.findFirst).toHaveBeenCalledWith({
        where: {
          name: body.name,
          clientId: client.id,
        },
      });
    });
  });
});
