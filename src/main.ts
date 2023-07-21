import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
      disableErrorMessages: false,
  }));
  app.use(cookieParser());
  await app.listen(env.PORT);
}
bootstrap();
