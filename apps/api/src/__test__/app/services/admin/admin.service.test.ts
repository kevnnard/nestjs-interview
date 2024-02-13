import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { AdminService } from '@ocmi/api/app/services/admin/admin.service';
import { Status } from '@prisma/client';

describe('AdminService', () => {
  let adminService: AdminService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, PrismaService],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getTimesheets', () => {
    it('should return all timesheets', async () => {
      const mockTimesheets = [
        {
          id: 1,
          note: 'note',
          status: 'PENDING' as Status,
          createdAt: new Date(),
          clientId: 1,
        },
        {
          id: 2,
          note: 'note',
          status: 'APROVED' as Status,
          createdAt: new Date(),
          clientId: 1,
        },
      ];
      jest
        .spyOn(prismaService.timeSheet, 'findMany')
        .mockResolvedValue(mockTimesheets);

      const result = await adminService.getTimesheets();

      expect(result).toEqual(mockTimesheets);
      expect(prismaService.timeSheet.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTimesheet', () => {
    it('should return a timesheet by ID', async () => {
      const mockTimesheet = {
        id: 7,
        note: 'note',
        status: 'PENDING' as Status,
        createdAt: new Date(),
        clientId: 1,
      };

      jest
        .spyOn(prismaService.timeSheet, 'findUnique')
        .mockResolvedValue(mockTimesheet);

      const result = await adminService.getTimesheet(1);

      expect(result).toEqual(mockTimesheet);
      expect(prismaService.timeSheet.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.timeSheet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { employees: true, client: true },
      });
    });

    it('should throw BadRequestException if timesheet is not found', async () => {
      jest.spyOn(prismaService.timeSheet, 'findUnique').mockResolvedValue(null);

      await expect(adminService.getTimesheet(10)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaService.timeSheet.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.timeSheet.findUnique).toHaveBeenCalledWith({
        where: { id: 10 },
        include: { employees: true, client: true },
      });
    });
  });

  describe('updateTimesheet', () => {
    it('should update a timesheet and return the updated timesheet', async () => {
      const mockTimesheet = {
        id: 1,
        note: 'note',
        status: 'PENDING' as Status,
        createdAt: new Date(),
        clientId: 1,
      };
      const mockUpdateData = {
        note: 'Updated note',
        status: 'PENDING' as Status,
      };
      jest
        .spyOn(prismaService.timeSheet, 'update')
        .mockResolvedValue(mockTimesheet);

      const result = await adminService.updateTimesheet(1, mockUpdateData);

      expect(result).toEqual(mockTimesheet);
      expect(prismaService.timeSheet.update).toHaveBeenCalledTimes(1);
      expect(prismaService.timeSheet.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateData,
      });
    });

    it('should throw BadRequestException if timesheet is not found', async () => {
      jest.spyOn(prismaService.timeSheet, 'update').mockResolvedValue(null);

      await expect(
        adminService.updateTimesheet(1, {
          note: 'Updated note',
          status: 'APROVED' as Status,
        }),
      ).rejects.toThrow(BadRequestException);
      expect(prismaService.timeSheet.update).toHaveBeenCalledTimes(1);
      expect(prismaService.timeSheet.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { note: 'Updated note', status: 'APROVED' as Status },
      });
    });
  });
});
