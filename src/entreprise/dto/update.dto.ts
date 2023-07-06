import { OrigineFonds, User } from "@prisma/client";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class UpdateEntrepriseDto {
    @IsNotEmpty()
    name:               string;
    @IsNotEmpty()
    nameResponsable:    string;
    @IsNotEmpty()
    telephone:          string;
    @IsNotEmpty()
    adress:             string;
    @IsNotEmpty()
    originefonds:       OrigineFonds;
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