import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@ocmi/api/app/configs/prisma/prisma.module';
import { EmployeeController } from '@ocmi/api/app/services/employee/employee.controller';
import { EmployeeService } from '@ocmi/api/app/services/employee/employee.service';
import { Client, Employe, PaymentType } from '@prisma/client';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [EmployeeController],
      providers: [EmployeeService],
      exports: [EmployeeService],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  // MOck data
  const mockClient: Client = {
    id: 1,
    name: 'John Doe',
    company: 'Ocmi',
    email: 'example@example.com',
    createdAt: new Date(),
    password: 'example1234',
  };
  const mockEmployees: Employe[] = [
    {
      id: 1,
      name: 'Employee 1',
      clientId: 1,
      createdAt: new Date(),
      paymentAmount: 14,
      paymentHour: 20,
      paymentType: 'HOURLY' as PaymentType,
    },
    {
      id: 2,
      name: 'Employee 2',
      clientId: 1,
      createdAt: new Date(),
      paymentAmount: 14,
      paymentHour: 20,
      paymentType: 'HOURLY' as PaymentType,
    },
  ];

  describe('getEmployees', () => {
    it('should return an array of employees', async () => {
      jest.spyOn(service, 'getEmployees').mockResolvedValue(mockEmployees);

      const result = await controller.getEmployees(mockClient);

      expect(result).toEqual(mockEmployees);
      expect(service.getEmployees).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('getEmployee', () => {
    it('should return an employee with the given ID', async () => {
      const mockId = 1;

      jest.spyOn(service, 'getEmployee').mockResolvedValue(mockEmployees[0]);

      const result = await controller.getEmployee(mockId, mockClient);

      expect(result).toEqual(mockEmployees[0]);
      expect(service.getEmployee).toHaveBeenCalledWith(mockId, mockClient);
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee and return the updated employee', async () => {
      const mockId = 1;
      const mockBody = mockEmployees[0];

      jest.spyOn(service, 'updateEmployee').mockResolvedValue(mockEmployees[0]);

      const result = await controller.updateEmployee(
        mockId,
        mockBody,
        mockClient,
      );

      expect(result).toEqual(mockEmployees[0]);
      expect(service.updateEmployee).toHaveBeenCalledWith(
        mockId,
        mockBody,
        mockClient,
      );
    });
  });

  describe('createEmployee', () => {
    it('should create a new employee and return the created employee', async () => {
      const mockBody = mockEmployees[0];

      jest.spyOn(service, 'createEmployee').mockResolvedValue(mockEmployees[0]);

      const result = await controller.createEmployee(mockBody, mockClient);

      expect(result).toEqual(mockEmployees[0]);
      expect(service.createEmployee).toHaveBeenCalledWith(mockBody, mockClient);
    });
  });
});
