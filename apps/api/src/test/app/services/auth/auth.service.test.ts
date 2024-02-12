import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@ocmi/api/app/configs/prisma/prisma.service';
import { AuthService } from '@ocmi/api/app/services/auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            admin: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('ClientSignIn', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      jest.spyOn(prismaService.client, 'findFirst').mockResolvedValue(null);

      await expect(
        authService.ClientSignIn({
          email: 'kevin.leo.24a@hotmail.com',
          password: 'Kevinleo982413',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      jest.spyOn(prismaService.client, 'findFirst').mockResolvedValue({
        id: 1,
        name: 'Kevin',
        company: 'OCMI',
        createdAt: new Date(),
        email: 'kevin.leo.24@hotmai.com',
        password:
          '$2b$10$OgaSv.xwC7ASSMdYmTh0.uKPSsf6tzsXLxF4sFk7iGaGuuD9Fnkpma',
      });

      //jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(
        authService.ClientSignIn({
          email: 'kevin.leo.24@hotmail.com',
          password: 'Kevinleo982413',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return a JwtResponse if user exists and password matches', async () => {
      const mockUser = {
        id: 1,
        name: 'Kevin',
        company: 'OCMI',
        createdAt: new Date(),
        email: 'kevin.leo.24@hotmail.com',
        password:
          '$2b$10$OgaSv.xwC7ASSMdYmTh0.uKPSsf6tzsXLxF4sFk7iGaGuuD9Fnkpm',
      };

      const mockJwtResponse = {
        token: 'mockToken',
      };

      jest.spyOn(prismaService.client, 'findFirst').mockResolvedValue(mockUser);
      //jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtResponse.token);

      const result = await authService.ClientSignIn({
        email: 'kevin.leo.24@hotmail.com',
        password: 'Kevinleo982413',
      });

      expect(result).toEqual(mockJwtResponse);
    });
  });

  describe('AdminSignIn', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      jest.spyOn(prismaService.admin, 'findFirst').mockResolvedValue(null);

      await expect(
        authService.AdminSignIn({
          email: 'londonokevin9@gmail.com',
          password: 'Kevinleo982413',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      jest.spyOn(prismaService.admin, 'findFirst').mockResolvedValue({
        id: 1,
        name: 'Kevin',
        createdAt: new Date(),
        email: 'londonokevin9@gmail.com',
        password:
          '$2b$10$OgaSv.xwC7ASSMdYmTh0.uKPSsf6tzsXLxF4sFk7iGaGuuD9Fnkpma',
      });

      //jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(
        authService.AdminSignIn({
          email: 'londonokevin9@gmail.com',
          password: 'Kevinleo982413',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return a JwtResponse if user exists and password matches', async () => {
      const mockUser = {
        id: 1,
        name: 'Kevin',
        company: 'OCMI',
        createdAt: new Date(),
        email: 'londonokevin9@gmail.com',
        password:
          '$2b$10$OgaSv.xwC7ASSMdYmTh0.uKPSsf6tzsXLxF4sFk7iGaGuuD9Fnkpm',
      };

      const mockJwtResponse = {
        token: 'mockToken',
      };

      jest.spyOn(prismaService.admin, 'findFirst').mockResolvedValue(mockUser);
      //jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtResponse.token);

      const result = await authService.AdminSignIn({
        email: 'londonokevin9@gmail.com',
        password: 'Kevinleo982413',
      });

      expect(result).toEqual(mockJwtResponse);
    });
  });

  describe('adminCreateUser', () => {
    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(prismaService.client, 'findFirst').mockResolvedValue({
        id: 1,
        name: 'Kevin',
        company: 'OCMI',
        createdAt: new Date(),
        email: 'Kevin.leo.24@hotmail.com',
        password:
          '$2b$10$OgaSv.xwC7ASSMdYmTh0.uKPSsf6tzsXLxF4sFk7iGaGuuD9Fnkpm',
      });

      await expect(
        authService.adminCreateUser({
          id: 1,
          name: 'Kevin',
          company: 'OCMI',
          createdAt: new Date(),
          email: 'Kevin.leo.24@hotmail.com',
          password: 'Kevinleo982413',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return a Client if user does not exist', async () => {
      const mockUser = {
        id: 1,
        name: 'Kevin',
        company: 'OCMI',
        createdAt: new Date(),
        email: 'Kevin.leo.98@hotmail.com',
        password:
          '$2b$10$OgaSv.xwC7ASSMdYmTh0.uKPSsf6tzsXLxF4sFk7iGaGuuD9Fnkpm',
      };

      jest.spyOn(prismaService.client, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.client, 'create').mockResolvedValue(mockUser);

      const result = await authService.adminCreateUser({
        id: 1,
        name: 'Kevin',
        company: 'OCMI',
        createdAt: new Date(),
        email: 'kevin.leo.98@hotmail.com',
        password: 'Kevinleo982413',
      });

      expect(result).toEqual(mockUser);
    });
  });
});
