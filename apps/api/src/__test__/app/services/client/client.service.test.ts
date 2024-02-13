import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { ClientService } from '@ocmi/api/app/services/client/client.service';
import { Client, Employe, Status, TimeSheet } from '@prisma/client';

describe('ClientService', () => {
  let clientService: ClientService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientService, PrismaService],
    }).compile();

    clientService = module.get<ClientService>(ClientService);
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
    password: 'example1234',
    company: 'Ocmi',
    createdAt: new Date(),
  };
  const employees: Employe[] = [
    {
      id: 1,
      name: 'John Doe',
      paymentType: 'HOURLY',
      paymentHour: 20,
      paymentAmount: 12,
      clientId: 1,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'John Doe 2',
      paymentType: 'SALARY',
      paymentHour: 0,
      paymentAmount: 480,
      clientId: 2,
      createdAt: new Date(),
    },
  ];
  const timesheets: TimeSheet[] = [
    {
      id: 1,
      note: 'note',
      status: 'PENDING' as Status,
      clientId: 1,
      createdAt: new Date(),
    },
    {
      id: 2,
      clientId: 2,
      note: 'note',
      status: 'APPROVED' as Status,
      createdAt: new Date(),
    },
  ];
  const timesheetData = {
    employees: employees.map((employee) => employee.id),
  };
  const payload = {
    id: 1,
    email: 'example@exmaple.com',
  };
  // * End of Mocking Data

  describe('getTimesheets', () => {
    it('should return an array of timesheets for the client', async () => {
      jest
        .spyOn(prismaService.timeSheet, 'findMany')
        .mockResolvedValue(timesheets);

      const result = await clientService.getTimesheets(client);

      expect(result).toEqual(timesheets);
      expect(prismaService.timeSheet.findMany).toHaveBeenCalledWith({
        include: {
          employees: true,
        },
        where: {
          clientId: client.id,
        },
      });
    });
  });

  describe('createTimesheet', () => {
    it('should create a new timesheet for the client', async () => {
      const createdTimesheet: TimeSheet = {
        id: 1,
        clientId: client.id,
        note: 'note',
        status: 'PENDING' as Status,
        createdAt: new Date(),
      };

      jest
        .spyOn(prismaService.timeSheet, 'create')
        .mockResolvedValue(createdTimesheet);

      const result = await clientService.createTimesheet(timesheetData, client);

      expect(result).toEqual(createdTimesheet);
      expect(prismaService.timeSheet.create).toHaveBeenCalledWith({
        data: {
          clientId: client.id,
          employees: {
            connect: employees.map((employee) => {
              return {
                id: employee.id,
              };
            }),
          },
        },
      });
    });

    it('should throw BadRequestException if timesheet creation fails', async () => {
      jest
        .spyOn(prismaService.timeSheet, 'create')
        .mockRejectedValue(new Error());

      await expect(
        clientService.createTimesheet(timesheetData, client),
      ).rejects.toThrow(BadRequestException);
      expect(prismaService.timeSheet.create).toHaveBeenCalledWith({
        data: {
          clientId: client.id,
          employees: {
            connect: employees.map((employee) => {
              return {
                id: employee.id,
              };
            }),
          },
        },
      });
    });
  });

  describe('validateClient', () => {
    it('should return the client if it exists', async () => {
      jest.spyOn(prismaService.client, 'findFirst').mockResolvedValue(client);

      const result = await clientService.validateClient(payload);

      expect(result).toEqual(client);
      expect(prismaService.client.findFirst).toHaveBeenCalledWith({
        where: {
          email: payload.email,
        },
      });
    });

    it('should return undefined if the client does not exist', async () => {
      jest.spyOn(prismaService.client, 'findFirst').mockResolvedValue(null);

      const result = await clientService.validateClient(payload);

      expect(result).toBeUndefined();
      expect(prismaService.client.findFirst).toHaveBeenCalledWith({
        where: {
          email: payload.email,
        },
      });
    });
  });
});
