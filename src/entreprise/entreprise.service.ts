import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { chiffreAffaire, Entreprise, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DetailPaimentsDto } from 'src/tva/detail-paiments-tva/dto/create.dto';
import { CreateChiffreAffaireDto, CreateEntrepriseDto, CreateManyChiffreAffaireDto, UpdateChiffreAffaireDto } from './dto/create.dto';
import { UpdateEntrepriseDto } from './dto/update.dto';
const bcrypt = require("bcrypt");

@Injectable()
export class EntrepriseService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateEntrepriseDto, id: number) {
        try {
            return await this.prisma.entreprise.create({
                data: {
                    userId: id,
                    name: data.name,
                    nameResponsable: data.nameResponsable,
                    telephone: data.telephone,
                    adress: data.adress,
                    originefonds: data.originefonds,
                    dateCreation: data.dateCreation,
                    dateEngagement: data.dateEngagement,
                    typeClients: data.typeClients,
                    tribunal: data.tribunal,
                    codeAcces: data.codeAcces,
                    MdpAdhesion: data.MdpAdhesion,
                    loginDgi: data.loginDgi,
                    mdpDgi: data.mdpDgi,
                    loginDamancom: data.loginDamancom,
                    mdpDamancom: data.mdpDamancom,
                    ice: data.ice,
                    if: data.if,
                    rc : data.rc,
                    cnss: data.cnss
                }
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code = "P2002")
                    throw new HttpException("Name entreprise aleardy exist", HttpStatus.FORBIDDEN)
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }

    async delete(id: number): Promise<Entreprise> {
        try {
            return await this.prisma.entreprise.delete({
                where: {
                    id: id,
                },
            })
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }

    async update(id: number, data: UpdateEntrepriseDto) {
        try {
            return await this.prisma.entreprise.update({
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
    async addChiffreAffire(data: CreateChiffreAffaireDto, id: number) {
        // if (data.annee == new Date().getFullYear())
        //     throw new HttpException("year not valid", 403)
        try {
            return await this.prisma.entreprise.update({
                where: {id: data.idEntreprise},
                data: {
                    chiffreAffaire: {
                        create: {
                            userId: id,
                            annee: data.annee,
                            price: data.price,
                        }
                    }
                },
            })
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }

    }
    async addManyChiffreAffire(data: CreateManyChiffreAffaireDto, id: number) {
        if(await this.prisma.entreprise.findFirst({
            where: {id: data.idEntreprise,}
        }) == null)
            throw new HttpException("id entreprise not valid", 403)
        try {
            let table = data.chiffreAffaire;
            table.forEach(el => {
                el.userId = id;
                el.idEntreprise = data.idEntreprise;
            }
                )
            await this.prisma.chiffreAffaire.createMany({
                data: table,
            })
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }

    }
    async updateChiffreAffaire(data: UpdateChiffreAffaireDto, id: number) {
        try {
            return await this.prisma.chiffreAffaire.update({
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
    async deleteCapitale(id: number) {
        try {
            return await this.prisma.chiffreAffaire.delete({
                where: { id: id },
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }

    }
    async findAll(skip: number, take: number): Promise<Entreprise[]> {
        try {
                return await this.prisma.entreprise.findMany({
                    include: {
                        chiffreAffaire: {
                            orderBy: {
                                annee: 'desc',
                            },
                            take: 1,
                        },
                        Tva: {
                            select: {
                                id: true,
                            }
                        }
                    },
                    ...(isNaN(skip) ? {} : {skip, take})
                })
            

        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }

    async findNumberEntrprise(): Promise<number> {
        try {
            return await this.prisma.entreprise.count();

        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
            }
        }
    }

    async findAllInformation(id: number, skip: number, take: number) {
        try {
            return await this.prisma.entreprise.findUnique({
                    where: {
                        id: id,
                    },
                    include: {
                        chiffreAffaire: {
                            orderBy: {
                                annee: 'desc'
                            },
                            take: 1,
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
    // async findAllInformation(id: number) {
    //     try {

    //     }
    // }
}
