import { Module } from '@nestjs/common';
import { TvaService } from './tva.service';
import { TvaController } from './tva.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [TvaService, PrismaService],
  exports: [TvaService],
  controllers: [TvaController],
})
export class TvaModule {}
