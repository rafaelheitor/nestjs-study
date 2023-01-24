import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './application/di/RootModule';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3333);
}
bootstrap();
