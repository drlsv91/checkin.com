import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new NestLogger(bootstrap.name);
  const app = await NestFactory.create(AuthModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const PORT = configService.get('PORT');
  await app.listen(PORT, () => logger.log(`Starting AUTH on port [${PORT}]`));
}
bootstrap();
