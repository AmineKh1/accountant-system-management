import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProspectDto {
    name:			    string;
	nameResponsable:	string;
	telephone:		    string;
} 