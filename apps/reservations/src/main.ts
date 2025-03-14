import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new NestLogger(bootstrap.name);
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  const PORT = configService.get('PORT');
  await app.listen(PORT, '0.0.0.0', () =>
    logger.log(`Starting application: [${PORT}]!`),
  );
}
bootstrap();
