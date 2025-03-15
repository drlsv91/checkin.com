import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { Logger as NestLogger } from '@nestjs/common';
import { NOTIFICATION_SERVICE } from '@app/common';

async function bootstrap() {
  const logger = new NestLogger(bootstrap.name);
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: NOTIFICATION_SERVICE,
    },
  });
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  logger.log(`Microservice application start on : [${PORT}]`);
}
bootstrap();
