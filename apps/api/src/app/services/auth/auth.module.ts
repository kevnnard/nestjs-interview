import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@ocmi/api/app/configs/prisma/prisma.module';
import { ClientModule } from '@ocmi/api/app/services/client/client.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAdminStrategy } from './strategies/admin.strategy';
import { JwtClientStrategy } from './strategies/client.strategy';

@Module({
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
})
export class AuthModule {}
