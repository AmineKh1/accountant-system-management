import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Prospect, Role } from '@prisma/client';
import { CreateEntrepriseDto } from 'src/entreprise/dto/create.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateProspectDto } from './dto/create.dto';
import { UpdateProspectDto } from './dto/update.dto';
const bcrypt = require("bcrypt");

@Injectable()
export class ProspectService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateProspectDto, id: number) {
        try {
            await this.prisma.prospect.create({
                data: {
                    userId: id,
                    name: data.name,
                    nameResponsable: data.nameResponsable,
                    telephone: data.telephone,
                }
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }
    async delete(id: number): Promise<Prospect> {
        try {
            return await this.prisma.prospect.delete({
                where: {
                    id
                },
            })
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }
    async findCountProspect() : Promise<number>  {
        return await this.prisma.prospect.count();
    }
    async findAll(skip: number, take: number): Promise<Prospect[]> {
            return await this.prisma.prospect.findMany({
                ...(isNaN(skip) ? {} : {skip, take})
            })

    }

    async update(id: number, data: UpdateProspectDto) {
        try{
            return this.prisma.prospect.update({
                where: { id: id, },
                data,
            })
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
        
    }
    async upgrade(data: CreateEntrepriseDto, id: number) {
        try {
            return await this.prisma.$transaction(async () => {
                const entreprise = await this.prisma.entreprise.create({
                    data: {
                        userId: id,
                        name: data.name,
                        nameResponsable: data.nameResponsable,
                        telephone: data.telephone,
                        adress: data.adress,
                        originefonds: data.originefonds,
                        dateCreation: data.dateCreation,
                        dateEngagement: data.dateEngagement,
                        typeClients: data.typeClients
                    }
                });
                await this.prisma.prospect.delete({
                    where: { id: id }
                })
                return entreprise;
            })
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, 402)
            }
        }
    }
}
