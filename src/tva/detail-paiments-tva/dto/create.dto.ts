import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsObject, ValidateNested } from "class-validator";
import { CreateChiffreAffaireDto } from "src/tva/dto/create.dto";

export class DetailPaimentsDto {
    // @IsNumber()
    annee:  number;
    ht: number;
    ttc:    number;
    remiseMad:   number;
    remisepours:   number;
    trimensual:    boolean;
    tvaId: number;
}
export class DetailPaimentsinTvaDto {
    @IsNumber()
    annee:  number;
    @IsNumber()
    ht: number;
    @IsNumber()
    ttc:    number;
    @IsNumber()
    remiseMad:   number;
    @IsNumber()
    remisepours:   number;
    @IsNumber()
    trimensual:    boolean;
    @IsNumber()
    tvaId: number;
}
export class createdetail {
    @ValidateNested()
    @Type(() => DetailPaimentsDto)
    @IsObject()
    detailPaiments:    DetailPaimentsDto;
    @ValidateNested()
    @Type(() => DetailPaimentsDto)
    @IsObject()
    chipreEl:    CreateChiffreAffaireDto;
}