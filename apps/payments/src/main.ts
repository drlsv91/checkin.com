import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { Logger as NestLogger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new NestLogger(bootstrap.name);
  const app = await NestFactory.create(PaymentsModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: PORT,
    },
  });

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  logger.log(`Microservice application start on : [${PORT}]`);
}
bootstrap();
