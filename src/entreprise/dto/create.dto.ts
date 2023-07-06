import { OrigineFonds, TypeClients, Entreprise } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsPhoneNumber, IsString, ValidateNested } from "class-validator";

export class CreateEntrepriseDto {

    @IsNotEmpty()
    @IsString()
    name:               string;
    @IsNotEmpty()
    @IsString()
    nameResponsable:    string;
    @IsString()
    telephone:          string;
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dateEngagement:     Date;
    @IsNotEmpty()
    @IsString()
    adress:             string;
    @IsEnum(OrigineFonds)
    @IsNotEmpty()
    originefonds:       OrigineFonds;
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dateCreation:       Date;
    @IsEnum(TypeClients)
    typeClients:     TypeClients;
    tribunal:           string;
    codeAcces:          string;
    MdpAdhesion:        string;
    loginDgi:           string;
    mdpDgi:             string;
    loginDamancom:      string;
    mdpDamancom:        string;
    ice:                string;
    if:                 string;
    rc:                 string;
    cnss:               string;
}

export class CreateChiffreAffaireDto {
    userId: number;
    @IsNumber()
    annee:        number;
    @IsNumber()
    price:        number;
    // @IsNumber()
    idEntreprise: number;
}
export class UpdateChiffreAffaireDto {
    @IsNumber()
    annee: number;
    @IsNumber()
    price:  number;
}

export class CreateManyChiffreAffaireDto {
    @IsNumber()
    idEntreprise: number;
    @ValidateNested()
    @Type(() =>  CreateChiffreAffaireDto)
    @IsArray()
    chiffreAffaire: CreateChiffreAffaireDto[];
}

export class findallentre{
        entreprises: Entreprise[];
        numb:         number;
}