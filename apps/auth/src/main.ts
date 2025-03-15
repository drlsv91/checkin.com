import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';

async function bootstrap() {
  const logger = new NestLogger(bootstrap.name);
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: AUTH_SERVICE,
    },
  });
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const PORT = configService.get('HTTP_PORT');
  await app.startAllMicroservices();
  await app.listen(PORT, '0.0.0.0', () =>
    logger.log(`Starting AUTH on port! [${PORT}]!`),
  );
}
bootstrap();
