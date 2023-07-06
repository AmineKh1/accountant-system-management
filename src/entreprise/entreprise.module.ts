import { Module } from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { EntrepriseController } from './entreprise.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [EntrepriseService, PrismaService],
  exports: [EntrepriseService],
  controllers: [EntrepriseController]
})
export class EntrepriseModule {}
