import { Diposer } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateDetailMounthTva {
    mounth: number;
    payer:  boolean;
    @IsEnum(Diposer)
    diposer:  Diposer;
    detailpaimentsId: number;
}
