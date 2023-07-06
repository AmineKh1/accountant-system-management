import { Diposer } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsNumber, ValidateNested, IsObject, IsString, IsBoolean, IsEnum } from "class-validator";
import internal from "stream";
import { DetailPaimentsDto } from "../detail-paiments-tva/dto/create.dto";

export class CreateTvaDto {
    userId: number;
    @IsDate()
    @Type(() => Date)
    dateDebutDossier:    Date;
    @IsNumber()
    entrepriseId:           number;
    @ValidateNested()
    @Type(() => DetailPaimentsDto)
    @IsObject()
    detailPaiments:    DetailPaimentsDto;
}

export class CreateDetailMounthTva {
    @IsNumber()
    mounth: number;
    @IsBoolean()
    payer:  boolean;
    @IsEnum(Diposer)
    diposer:  Diposer;
}

export class CreateChiffreAffaireDto {
    userId: number;
    @IsNumber()
    annee:        number;
    @IsNumber()
    price:        number;
    @IsNumber()
    idEntreprise: number;
    @IsNumber()
    idtva: number;
}
