import { Module } from '@nestjs/common';
import { PaimentService } from './paiment.service';
import { PaimentController } from './paiment.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PaimentService, PrismaService],
  controllers: [PaimentController]
})
export class PaimentModule {}
