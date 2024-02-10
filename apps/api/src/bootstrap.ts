import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@ocmi/api/app/app.module';

export const globalPrefix = 'api';

export const createSwaggerDocument = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('Spikey')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('spikey')
    .addBearerAuth()
    .build();

  return SwaggerModule.createDocument(app, config);
};

export const getApp = async () => {
  /**
   * Initialize the NestJS application
   */
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);

  return app;
};
