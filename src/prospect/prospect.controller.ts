import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Prospect, Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/role.guard';
import { CreateEntrepriseDto } from 'src/entreprise/dto/create.dto';
import { CreateProspectDto } from './dto/create.dto';
import { UpdateProspectDto } from './dto/update.dto';
import { ProspectService } from './prospect.service';

@Controller('prospects')
export class ProspectController {
    constructor(private prospectService: ProspectService){ }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    @Post('/create')
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() data: CreateProspectDto, @Request() req) {
        return this.prospectService.create(data, req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    @Post('/toentreprise')
    @UsePipes(new ValidationPipe({ transform: true }))
    upgrade(@Body() data: CreateEntrepriseDto, @Request() req) {
        return this.prospectService.upgrade(data, req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    @Delete('/:id')
    async deleteProspect(@Param('id') id: string): Promise<Prospect> {
        return this.prospectService.delete(+id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    findAll(@Query('skip') skip: string, @Query('take') take: string){
        return this.prospectService.findAll(+skip, +take);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/Count')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    findCountbProspect(){
        return this.prospectService.findCountProspect();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    @Patch('/:id')
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id') id: string, @Body() updateEntrepriseDto: UpdateProspectDto) {
        return this.prospectService.update(+id, updateEntrepriseDto);
    }

}
