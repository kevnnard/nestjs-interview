import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '@ocmi/api/app/services/auth/auth.module';
import { ClientModule } from '@ocmi/api/app/services/client/client.module';
import { HelloCommand } from '@ocmi/api/commands/hello.command';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelloCommand],
})
export class AppModule {}
