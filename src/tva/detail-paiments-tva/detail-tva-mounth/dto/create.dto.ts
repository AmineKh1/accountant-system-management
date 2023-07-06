import { Diposer } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber } from "class-validator";

export class CreateDetailMounthTva {
    @IsNumber()
    mounth: number;
    @IsBoolean()
    payer:  boolean;
    @IsEnum(Diposer)
    diposer:  Diposer;
    @IsNumber()
    detailpaimentsId: number;
}

