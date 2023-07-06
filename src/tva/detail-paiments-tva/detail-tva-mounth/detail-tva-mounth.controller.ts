import { Body, Controller, Get, Param, Patch, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/auth/role.guard';
import { DetailTvaMounthService } from './detail-tva-mounth.service';
import { UpdateDetailMounthTva } from './dto/update.dto';

@Controller('detailTvaMounth')
export class DetailTvaMounthController {
    constructor(private detailTvaMounthService: DetailTvaMounthService) {}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(":id")
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    findAllforEntre(@Param('id') id: string, @Query('skip') skip: string, @Query('take') take: string){
        console.log(id)
        return this.detailTvaMounthService.findAllforEnt(+id, +skip, +take);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(":id/count")
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    findAllforEntreCount(@Param() id: number){
        return this.detailTvaMounthService.getCountALLforEnt(id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @Roles(Role.ADMIN, Role.EMPLOY_SENIOR)
    updateMonth(@Param('id') id: string,@Body()  data: UpdateDetailMounthTva){
        return this.detailTvaMounthService.updateMonth(+id, data);
    }
}
