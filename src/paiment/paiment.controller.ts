import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard, Roles } from 'src/auth/role.guard';
import { PaimentTvaDto } from './dto/create.dto';
import { PaimentService } from './paiment.service';

@Controller('paiment')
export class PaimentController {
    constructor (private paimentsService: PaimentService) { }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/payerTva')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    payerTva(@Body() data: PaimentTvaDto, @Request() req) {
        return this.paimentsService.PayerTva(data, req.user.id);
    }
}
