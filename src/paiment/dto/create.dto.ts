import { IsNumber } from "class-validator";

export class PaimentTvaDto {
    @IsNumber()
    price: number;
    @IsNumber()
    tvaId: number;
    userId: number;
}