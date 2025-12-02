import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { Logger, TLogger } from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.enableCors({
    origin: process.env.FRONT_URL || 'http://localhost:5173',
  });

  const loggerType = (process.env.LOGGER_TYPE || 'dev') as TLogger;
  const logger = Logger.create(loggerType);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}
bootstrap();
