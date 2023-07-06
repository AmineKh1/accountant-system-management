import { IsDate, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreateProspectDto {

    @IsNotEmpty()
    name:			    string;
    @IsNotEmpty()
    @IsString()
	nameResponsable:	string;
    @IsNotEmpty()
    @IsString()
	telephone:		    string;
}