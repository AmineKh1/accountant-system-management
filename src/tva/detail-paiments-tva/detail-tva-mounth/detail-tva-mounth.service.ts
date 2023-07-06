import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Diposer, PaimentsPerMouth, Prisma } from '@prisma/client';
import { isIdentityCard } from 'class-validator';
import { EntrepriseController } from 'src/entreprise/entreprise.controller';
import { PrismaService } from 'src/prisma.service';
import { CreateDetailMounthTva } from './dto/create.dto';
import { UpdateDetailMounthTva } from './dto/update.dto';
@Injectable()
export class DetailTvaMounthService {
    constructor(private prisma: PrismaService) { }
    private readonly logger = new Logger(DetailTvaMounthService.name);


    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async create() {
        let monthIndex: number = new Date().getMonth();
        let prm: CreateDetailMounthTva[] = [];
        const ids = await this.prisma.detailpaiments.findMany({
            select: {
                trimensual: true,
                id: true,
                Tva: {
                    select: {
                        dateDebutDossier: true,
                    }
                }
            }
        })
        ids.forEach((el) => {
            let tabDate: number[] = [];
            let month: number = el.Tva.dateDebutDossier.getMonth();
            while (tabDate.length <= 4) {
                tabDate.push(month);
                month = month + 3;
                if (month > 12) {
                    month = month - 12;
                }
            }
            if (el.trimensual == true && tabDate.includes(monthIndex) == true) {
                let obj: CreateDetailMounthTva = {
                    detailpaimentsId: el.id,
                    diposer: Diposer.NO_DIPOSER,
                    mounth: monthIndex,
                    payer: false,
                };
                prm.push(obj);
            }
            else if (el.trimensual == false) {
                let obj: CreateDetailMounthTva = {
                    detailpaimentsId: el.id,
                    diposer: Diposer.NO_DIPOSER,
                    mounth: monthIndex,
                    payer: false,
                };
                prm.push(obj);
            }
        })
        // console.log(prm);
        await this.prisma.paimentsPerMouth.createMany({
            data: prm,
        })
    }

    async findAllforEnt(id: number, skip: number, take: number) {
        try {
            // let i: number = id;
            // id = 1;
            return await this.prisma.detailpaiments.findMany({
                 where : {
                    Tva: {
                        entrepriseId: id,
                    }
                },
                select: {
                    annee: true,
                    trimensual: true,
                    PaimentsPerMouth: true
                    
                },
               
                ...(isNaN(skip) ? {} : {skip, take})
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
          }
    }
    async getCountALLforEnt(id: number) : Promise<number> {
        return this.prisma.detailpaiments.count({
            where : {
                Tva: {
                    entrepriseId: id,
                }
            },
        })
    }

    async updateMonth(id: number, data: UpdateDetailMounthTva) : Promise<PaimentsPerMouth> {
        try {
            return await this.prisma.paimentsPerMouth.update({
                where: {id: id,},
                data,
            })
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }




}

