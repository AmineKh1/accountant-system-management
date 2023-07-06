import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Cron, CronExpression,  } from '@nestjs/schedule';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: ['http://localhost:3000'], credentials: true});
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(8040);
  app.use(cookieParser());
}
bootstrap();
