import { Body, Controller, Get, Post,  Query,  Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard, Roles } from 'src/auth/role.guard';

import { createdetail, DetailPaimentsDto, DetailPaimentsinTvaDto } from './detail-paiments-tva/dto/create.dto';
import { CreateTvaDto, CreateChiffreAffaireDto } from './dto/create.dto';
import { TvaService } from './tva.service';

@Controller('tva')
export class TvaController {
    constructor(private tvaService: TvaService) { }
//jdid
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/check')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    check(@Body() data: CreateTvaDto) {
        // console.log(data);
        return this.tvaService.check(data);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/create')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    create(@Body() data: CreateTvaDto, @Request() req) {
        // console.log(data)
        return this.tvaService.create(data, req.user.id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    findAll(@Query('skip') skip: string, @Query('take') take: string){
        return this.tvaService.findAll(+skip, +take);
    }
//9dim
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/Createchiffre')//addchiffre then send it to /check or / createDetail
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    createChiffre(@Body() data: CreateChiffreAffaireDto, @Request() req){
        return this.tvaService.addChiffreAffire(data, req.user.id);
    }
//idoz hna
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/createDetail')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    createDetails(@Body() data: createdetail, @Request() req){

        // console.log(data.tvaId)
        return this.tvaService.createDetail(data, req.user.id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/count')
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    getcount(){
        return this.tvaService.getCount();
    }
}
