import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(ReservationsModule);
  const PORT = process.env.port ?? 3000;
  await app.listen(PORT, () => logger.log(`Starting application: ${PORT}`));
}
bootstrap();
