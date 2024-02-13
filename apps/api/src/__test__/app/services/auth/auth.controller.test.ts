import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@ocmi/api/app/configs/prisma/prisma.module';
import { AuthController } from '@ocmi/api/app/services/auth/auth.controller';
import { AuthService } from '@ocmi/api/app/services/auth/auth.service';
import { JwtAdminStrategy } from '@ocmi/api/app/services/auth/strategies/admin.strategy';
import { JwtClientStrategy } from '@ocmi/api/app/services/auth/strategies/client.strategy';
import { ClientModule } from '@ocmi/api/app/services/client/client.module';
import { Admin, Client } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ session: true }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
          }),
        }),
        PrismaModule,
        ClientModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtAdminStrategy, JwtClientStrategy],
      exports: [JwtAdminStrategy, JwtClientStrategy, PassportModule, JwtModule],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('clientSignIn', () => {
    it('should return a JWT token for client sign-in', async () => {
      const client: Client = {
        id: 1,
        name: 'example',
        company: 'Ocmi',
        email: 'example@exmaple.com',
        password: 'example1234',
        createdAt: new Date(),
      };
      const expectedJwtResponse = {
        token: 'jwt.token',
      };

      jest
        .spyOn(authService, 'ClientSignIn')
        .mockResolvedValue(expectedJwtResponse);

      const result = await authController.clientSignIn(client);

      expect(result).toEqual(expectedJwtResponse);
      expect(authService.ClientSignIn).toHaveBeenCalledWith(client);
    });
  });

  describe('adminSignIn', () => {
    it('should return a JWT token for admin sign-in', async () => {
      const admin: Admin = {
        id: 1,
        name: 'Example',
        email: 'example@example.com',
        password: 'example1234',
        createdAt: new Date(),
      };
      const expectedJwtResponse = {
        token: 'jwt.token',
      };

      jest
        .spyOn(authService, 'AdminSignIn')
        .mockResolvedValue(expectedJwtResponse);

      const result = await authController.adminSignIn(admin);

      expect(result).toEqual(expectedJwtResponse);
      expect(authService.AdminSignIn).toHaveBeenCalledWith(admin);
    });
  });

  describe('adminCreateUser', () => {
    it('should create a new user and return the user data', async () => {
      const client: Client = {
        id: 1,
        name: 'example',
        company: 'Ocmi',
        email: 'example@exmaple.com',
        password: 'example1234',
        createdAt: new Date(),
      };

      const expectedClient = {
        id: 1,
        name: 'example',
        company: 'Ocmi',
        email: 'example@exmaple.com',
        password: 'example1234',
        createdAt: new Date(),
      };

      jest
        .spyOn(authService, 'adminCreateUser')
        .mockResolvedValue(expectedClient);

      const result = await authController.adminCreateUser(client);

      expect(result).toEqual(expectedClient);
      expect(authService.adminCreateUser).toHaveBeenCalledWith(client);
    });
  });
});
