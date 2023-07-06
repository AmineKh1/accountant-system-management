import { Module } from '@nestjs/common';
import { DetailTvaMounthService } from './detail-tva-mounth.service';
import { DetailTvaMounthController } from './detail-tva-mounth.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [DetailTvaMounthService, PrismaService],
  exports: [DetailTvaMounthService],
  controllers: [DetailTvaMounthController]
})
export class DetailTvaMounthModule {}
