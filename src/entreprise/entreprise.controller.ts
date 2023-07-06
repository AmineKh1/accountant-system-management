import { Request, Controller, Post, Get, UseGuards, UsePipes, ValidationPipe,  Body, Delete, Param, Patch, Query } from '@nestjs/common';
import { Entreprise, Role, chiffreAffaire } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/role.guard';
import { CreateChiffreAffaireDto, CreateEntrepriseDto, CreateManyChiffreAffaireDto, UpdateChiffreAffaireDto } from './dto/create.dto';
import { UpdateEntrepriseDto } from './dto/update.dto';
import { EntrepriseService } from './entreprise.service';

@Controller('entreprise')
export class EntrepriseController {
    constructor(private entrepriseService: EntrepriseService) { }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/create')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    create(@Body() data: CreateEntrepriseDto, @Request() req) {
        // console.log(data,req.user.id)
        return this.entrepriseService.create(data, req.user.id);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/capitale/create')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    createChiffreAffire(@Body() data: CreateChiffreAffaireDto, @Request() req){
        return this.entrepriseService.addChiffreAffire(data, req.user.id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/capitale/:id')
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    deleteCapitale(@Param('id') id: string): Promise<chiffreAffaire> {
        return this.entrepriseService.deleteCapitale(+id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    findAll(@Query('skip') skip: string, @Query('take') take: string){
        return this.entrepriseService.findAll(+skip, +take);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/count')
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    findEntreCount(){
        return this.entrepriseService.findNumberEntrprise();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    @Delete(':id')
    async deleteEntreprise(@Param('id') id: string): Promise<Entreprise> {
        return this.entrepriseService.delete(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id') id: string, @Body() updateEntrepriseDto: UpdateEntrepriseDto) {
        return this.entrepriseService.update(+id, updateEntrepriseDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    @Patch('/capitale/:id')
    @UsePipes(new ValidationPipe({ transform: true }))
    updateChiffreAffaire(@Param('id') id: string, @Body() data: UpdateChiffreAffaireDto) {
        return this.entrepriseService.updateChiffreAffaire(data, +id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/capitale/createMany')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    createManyChiffreAffire(@Body() data: CreateManyChiffreAffaireDto, @Request() req){
        return this.entrepriseService.addManyChiffreAffire(data, req.user.id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/entreprise/:id')
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    findAllInofrmation(@Param('id') id: string, @Query('skip') skip: string, @Query('take') take: string){
        return this.entrepriseService.findAllInformation(+id, +skip, +take);
    }
}
