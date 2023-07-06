import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from "@prisma/client";

export class UpdateUserDto {
  @IsEmail()
  email: string;

  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;
}
