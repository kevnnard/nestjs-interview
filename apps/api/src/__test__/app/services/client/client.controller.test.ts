import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@ocmi/api/app/configs/prisma/prisma.module';
import { ClientController } from '@ocmi/api/app/services/client/client.controller';
import { ClientService } from '@ocmi/api/app/services/client/client.service';
import { Client, Status, TimeSheet } from '@prisma/client';

describe('ClientController', () => {
  let clientController: ClientController;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ClientController],
      providers: [ClientService],
      exports: [ClientService],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
  });

  describe('getAllTimesheets', () => {
    it('should return an array of timesheets', async () => {
      const expectedTimesheets = [];

      jest
        .spyOn(clientService, 'getTimesheets')
        .mockResolvedValue(expectedTimesheets);

      const result = await clientController.getTimesheets({} as Client);

      expect(result).toEqual(expectedTimesheets);
      expect(clientService.getTimesheets).toHaveBeenCalledWith({} as Client);
    });
  });

  describe('createTimesheet', () => {
    it('should create a timesheet and return it', async () => {
      const data: [number] = [1];
      const expectedTimesheet: TimeSheet = {
        id: 1,
        note: 'Timesheet 1',
        status: 'PENDING' as Status,
        clientId: 1,
        createdAt: new Date(),
      };

      jest
        .spyOn(clientService, 'createTimesheet')
        .mockResolvedValue(expectedTimesheet);

      const result = await clientController.createTimesheet(data, {} as Client);

      expect(result).toEqual(expectedTimesheet);
      expect(clientService.createTimesheet).toHaveBeenCalledWith(
        data,
        {} as Client,
      );
    });
  });
});
