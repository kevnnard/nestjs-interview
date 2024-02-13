import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@ocmi/api/app/configs/prisma/prisma.module';
import { AdminController } from '@ocmi/api/app/services/admin/admin.controller';
import { AdminService } from '@ocmi/api/app/services/admin/admin.service';
import { Status, TimeSheet } from '@prisma/client';

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AdminController],
      providers: [AdminService],
    }).compile();

    adminController = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  describe('getAllTimesheets', () => {
    it('should return an array of timesheets', async () => {
      const expectedTimesheets: TimeSheet[] = [
        {
          id: 1,
          note: 'Timesheet 1',
          status: 'PENDING' as Status,
          clientId: 1,
          createdAt: new Date(),
        },
        {
          id: 2,
          note: 'Timesheet 2',
          status: 'APROVED' as Status,
          clientId: 1,
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(adminService, 'getTimesheets')
        .mockResolvedValue(expectedTimesheets);

      const result = await adminController.getAllTimesheets();

      expect(result).toEqual(expectedTimesheets);
      expect(adminService.getTimesheets).toHaveBeenCalled();
    });
  });

  describe('getTimesheet', () => {
    it('should return the timesheet with the given ID', async () => {
      const id = 1;
      const expectedTimesheet: TimeSheet = {
        id: 1,
        note: 'Timesheet 1',
        status: 'PENDING' as Status,
        clientId: 1,
        createdAt: new Date(),
      };

      jest
        .spyOn(adminService, 'getTimesheet')
        .mockResolvedValue(expectedTimesheet);

      const result = await adminController.getTimesheet(id);

      expect(result).toEqual(expectedTimesheet);
      expect(adminService.getTimesheet).toHaveBeenCalledWith(id);
    });
  });

  describe('updateTimesheet', () => {
    it('should update the timesheet with the given ID and return the updated timesheet', async () => {
      const id = 1;
      const body = { note: 'Updated note', status: 'APROVED' as Status };
      const expectedUpdatedTimesheet: TimeSheet = {
        id: 1,
        note: 'Updated note',
        status: 'APPROVED' as Status,
        clientId: 1,
        createdAt: new Date(),
      };

      jest
        .spyOn(adminService, 'updateTimesheet')
        .mockResolvedValue(expectedUpdatedTimesheet);

      const result = await adminController.updateTimesheet(id, body);

      expect(result).toEqual(expectedUpdatedTimesheet);
      expect(adminService.updateTimesheet).toHaveBeenCalledWith(id, body);
    });
  });
});
