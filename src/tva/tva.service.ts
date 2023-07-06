import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Detailpaiments, Prisma, Tva } from '@prisma/client';
import { last, of } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { createdetail, DetailPaimentsDto, DetailPaimentsinTvaDto } from './detail-paiments-tva/dto/create.dto';
import { CreateDetailMounthTva, CreateTvaDto, CreateChiffreAffaireDto } from './dto/create.dto';


@Injectable()
export class TvaService {
    constructor(private prisma: PrismaService) { }
    async check(data: CreateTvaDto) {
        try {
            const entreprise = await this.prisma.entreprise.findFirst({
                where: {
                    id: data.entrepriseId,
                },
                include: {
                    chiffreAffaire: true,
                }
            })
            let annee = data.dateDebutDossier.getFullYear();

            var chipreEl = entreprise.chiffreAffaire.find((obj) => {
                return obj.annee === annee;
            })
            if(chipreEl == null)
                throw new HttpException("Date debut dossier math any Chiffre affaire in data base", HttpStatus.NOT_ACCEPTABLE)

            // if (entreprise.chiffreAffaire.length > 1)
            //     data.dateDebutDossier.setMonth(1);
            let ht_: number;
            let ttc_: number;
            let trimens_: boolean = false;
            if (chipreEl.price < 1000000) {
                ht_ = 900;
                ttc_ = 1080;
                trimens_ = true;
            }
            else if (chipreEl.price >= 1000000 && chipreEl.price < 3000000) {
                ht_ = 700;
                ttc_ = 840;
            }
            else if (chipreEl.price >= 3000000 && chipreEl.price < 5000000) {
                ht_ = 1000;
                ttc_ = 1200;
            }
            else if (chipreEl.price >= 5000000 && chipreEl.price < 8000000) {
                ht_ = 1300;
                ttc_ = 1560;
            }
            else {
                ht_ = 1500;
                ttc_ = 1800;
            }
            let obj: DetailPaimentsDto = {
                annee: annee,
                ht: ht_,
                ttc: ttc_,
                trimensual: trimens_,
                remiseMad: 0,
                remisepours: 0,
                tvaId: null,
            }
            data.detailPaiments = obj;
            return { data };
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }
    async create(data: CreateTvaDto, id: number) {
        try {

            data.userId = id;
            let objMounth: CreateDetailMounthTva[] = [];
            let tabDate: number[] = [];
            let monthIndex: number = new Date().getMonth() + 1;
            let month: number = data.dateDebutDossier.getMonth() + 1;
            if (data.dateDebutDossier.getFullYear() < new Date().getFullYear())
                month = 12;
            if (data.detailPaiments.trimensual == false) {
                while (month <= monthIndex) {
                    console.log(month)
                    let value: CreateDetailMounthTva =
                    {
                        mounth: month,
                        diposer: 'NO_DIPOSER',
                        payer: false
                    };
                    objMounth.push(value);
                    month++;

                }
            }
            else {
                let m = month;
                while (tabDate.length < 4) {
                    tabDate.push(month);
                    month = month + 3;
                    if (month > 12)
                        month = month - 12;
                    console.log(tabDate)
                }
                while (m <= monthIndex) {
                    if (tabDate.includes(m) == true) {
                        let value: CreateDetailMounthTva =
                        {
                            mounth: m,
                            diposer: 'NO_DIPOSER',
                            payer: false
                        };
                        objMounth.push(value);
                    }
                    m++;
                }

            }
            return await this.prisma.tva.create({
                data: {
                    dateDebutDossier: data.dateDebutDossier,
                    entrepriseId: data.entrepriseId,
                    userId: data.userId,
                    detailpaiments: {
                        create: {
                            userId: data.userId,
                            annee: data.detailPaiments.annee,
                            ht: data.detailPaiments.ht,
                            ttc: data.detailPaiments.ttc,
                            remiseMad: data.detailPaiments.remiseMad,
                            remisepours: data.detailPaiments.remisepours,
                            trimensual: data.detailPaiments.trimensual,
                            PaimentsPerMouth: {
                                createMany: {
                                    data: objMounth,
                                }
                            }
                        },
                    }
                }
            })
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }
    async createDetail(data: createdetail, id: number) {
        try {
            let objMounth: CreateDetailMounthTva[] = [];
            let tabDate: number[] = [];
            let monthIndex: number = new Date().getMonth();
            let month: number = 1;
            if (data.detailPaiments.trimensual == false) {
                while (month <= monthIndex) {
                    let value: CreateDetailMounthTva =
                    {
                        mounth: month,
                        diposer: 'NO_DIPOSER',
                        payer: false
                    };
                    objMounth.push(value);
                    month++;

                }
            }
            else {

                let m = month;
                while (tabDate.length < 4) {
                    tabDate.push(month);
                    month = month + 3;
                    if (month > 12)
                        month = month - 12;
                    console.log(tabDate)
                }
                while (m <= monthIndex) {
                    if (tabDate.includes(m) == true) {
                        let value: CreateDetailMounthTva =
                        {
                            mounth: m,
                            diposer: 'NO_DIPOSER',
                            payer: false
                        };
                        objMounth.push(value);
                    }
                    m++;
                }
            }
            const chiffre  = await this.prisma.chiffreAffaire.upsert({
                where: {
                    idEntreprise_annee: {
                        idEntreprise: data.chipreEl.idEntreprise,
                        annee: data.chipreEl.annee
                    }
                },
                update: {

                },
                create: {
                    userId: id,
                    annee: data.chipreEl.annee,
                    price: data.chipreEl.price,
                    idEntreprise: data.chipreEl.idEntreprise
                },
                
            })
            const dt = this.prisma.detailpaiments.create({
                data: {
                    userId: id,
                    annee: data.detailPaiments.annee,
                    ht: data.detailPaiments.ht,
                    ttc: data.detailPaiments.ttc,
                    remiseMad: data.detailPaiments.remiseMad,
                    remisepours: data.detailPaiments.remisepours,
                    trimensual: data.detailPaiments.trimensual,
                    tvaId: data.detailPaiments.tvaId,
                    PaimentsPerMouth: {
                        createMany: {
                            data: objMounth,
                        }
                    }
                }
            })
            return {dt, chiffre};
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }

    async checkchiffre(data: CreateChiffreAffaireDto, id: number) {
        try {
            let chipreEl: CreateChiffreAffaireDto = {
                    userId: id,
                    annee: data.annee,
                    price: data.price,
                    idEntreprise: data.idEntreprise,
                    idtva: data.idtva
                }
            
            let ht_: number;
            let ttc_: number;
            let trimens_: boolean = false;
            if (chipreEl.price < 1000000) {
                ht_ = 900;
                ttc_ = 1080;
                trimens_ = true;
            }
            else if (chipreEl.price >= 1000000 && chipreEl.price < 3000000) {
                ht_ = 700;
                ttc_ = 840;
            }
            else if (chipreEl.price >= 3000000 && chipreEl.price < 5000000) {
                ht_ = 1000;
                ttc_ = 1200;
            }
            else if (chipreEl.price >= 5000000 && chipreEl.price < 8000000) {
                ht_ = 1300;
                ttc_ = 1560;
            }
            else {
                ht_ = 1500;
                ttc_ = 1800;
            }
            let detailPaiments: DetailPaimentsDto = {
                annee: data.annee,
                ht: ht_,
                ttc: ttc_,
                trimensual: trimens_,
                remiseMad: 0,
                remisepours: 0,
                tvaId: data.idtva,
            }
            // console.log(obj)
            return { detailPaiments, chipreEl };
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }

    }
    async addChiffreAffire(data: CreateChiffreAffaireDto, id: number) {
        try {
            let chipreEl: CreateChiffreAffaireDto = {
                    userId: id,
                    annee: data.annee,
                    price: data.price,
                    idEntreprise: data.idEntreprise,
                    idtva: data.idtva
                }
            
            let ht_: number;
            let ttc_: number;
            let trimens_: boolean = false;
            if (chipreEl.price < 1000000) {
                ht_ = 900;
                ttc_ = 1080;
                trimens_ = true;
            }
            else if (chipreEl.price >= 1000000 && chipreEl.price < 3000000) {
                ht_ = 700;
                ttc_ = 840;
            }
            else if (chipreEl.price >= 3000000 && chipreEl.price < 5000000) {
                ht_ = 1000;
                ttc_ = 1200;
            }
            else if (chipreEl.price >= 5000000 && chipreEl.price < 8000000) {
                ht_ = 1300;
                ttc_ = 1560;
            }
            else {
                ht_ = 1500;
                ttc_ = 1800;
            }
            let detailPaiments: DetailPaimentsDto = {
                annee: data.annee,
                ht: ht_,
                ttc: ttc_,
                trimensual: trimens_,
                remiseMad: 0,
                remisepours: 0,
                tvaId: data.idtva,
            }
            // console.log(obj)
            return { detailPaiments, chipreEl };
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }

    }

    async findAll(skip: number, take: number): Promise<Tva[]> {
        try {
            return await this.prisma.tva.findMany({
                include: {
                    entreprise: {
                        select: {
                            id: true,
                            name: true,
                            nameResponsable: true,
                        }
                    },
                    detailpaiments: {
                        orderBy: {
                            annee: 'desc',
                        },
                        take: 1,
                    }
                },
                ...(isNaN(skip) ? {} : { skip, take })
            })


        }

        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }
    async getCount(): Promise<number> {
        return await this.prisma.tva.count();
    }
}

