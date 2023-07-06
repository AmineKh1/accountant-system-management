import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PaimentTvaDto } from './dto/create.dto';

@Injectable()
export class PaimentService {
    constructor(private prisma: PrismaService) { }

    async PayerTva(data: PaimentTvaDto, id: number) {
        
        try {
            data.userId = id;
            const paieTva = await this.prisma.paimentTva.create({
                data,
                include: {
                    tva: true,
                }
            })
            const cridit_details = await this.prisma.credit_details.findFirst({
                where: {
                    entrepriseId: paieTva.tva.entrepriseId,
                }
            })
            await this.prisma.credit_details.update({
                where: {
                    entrepriseId: paieTva.tva.entrepriseId,
                },
                data: {
                    restTva: cridit_details.restTva - paieTva.price,
                }
            })
            const detailsTva = await this.prisma.detailpaiments.findMany({
                select: {
                    annee: true,
                    ht: true,
                    ttc: true,
                    PaimentsPerMouth: true,
                },
                where: {
                    tvaId: data.tvaId,
                }
            })
            let calcul: number = paieTva.price;
            let cal: number;
            detailsTva.forEach(el => {
                el.PaimentsPerMouth.forEach(async ele => {
                    cal = el.ht + el.ttc;
                    if (calcul >= cal) {
                        ele.payer = true;
                        await this.prisma.paimentsPerMouth.update({
                            where: {
                                id: ele.id,
                            },
                            data: {
                                payer: true,
                            }
                        })
                    }
                    calcul = calcul - cal;
                });
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }
}
