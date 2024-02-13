import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '@ocmi/api/app/services/auth/auth.module';
import { ClientModule } from '@ocmi/api/app/services/client/client.module';
import { EmployeeModule } from '@ocmi/api/app/services/employee/employee.module';
import { HelloCommand } from '@ocmi/api/commands/hello.command';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './services/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    ClientModule,
    EmployeeModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelloCommand],
})
export class AppModule {}
