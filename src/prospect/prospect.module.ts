import { Module } from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { ProspectController } from './prospect.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ProspectService, PrismaService],
  exports: [ProspectService],
  controllers: [ProspectController]
})
export class ProspectModule {}
