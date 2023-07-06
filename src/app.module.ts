import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProspectModule } from './prospect/prospect.module';
import { EntrepriseModule } from './entreprise/entreprise.module';
import { TvaModule } from './tva/tva.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DetailTvaMounthService } from './tva/detail-paiments-tva/detail-tva-mounth/detail-tva-mounth.service';
import { PrismaService } from './prisma.service';
import { PaimentModule } from './paiment/paiment.module';
import { DetailTvaMounthModule } from './tva/detail-paiments-tva/detail-tva-mounth/detail-tva-mounth.module';

@Module({
  imports: [AuthModule, UsersModule, DetailTvaMounthModule, ProspectModule, EntrepriseModule, TvaModule, ScheduleModule.forRoot(), PaimentModule],
  controllers: [AppController],
  providers: [AppService, DetailTvaMounthService, PrismaService],
})
export class AppModule {}
