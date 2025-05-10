import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminNrcService } from './adminNrc.service';
import { CreateNrcDto } from './create-nrc.dto';


@Controller('admin')
export class AdminNrcController {
  constructor(private adminService: AdminNrcService) {}

  @Post('createNrc')
  createNrc(@Body() data: CreateNrcDto) {
    return this.adminService.createNrc(data);
  }

  @Get('getNrcs')
  getNrcs() {
    return this.adminService.getNrcs();
  }

  @Get('getNrcById/:id')
  getNrcById(@Param('id') id: string) {
    return this.adminService.getNrcById(Number(id));
  }

  @Get('getNrcByMateria/:materiaId')
  getNrcByMateria(@Param('materiaId') materiaId: string) {
    return this.adminService.getNrcByMateria(Number(materiaId));
  }

  @Put('updateNrc/:id')
  updateNrc(@Param('id') id: string, @Body() data: CreateNrcDto) {
    return this.adminService.updateNrc(Number(id), data);
  }

  @Delete('deleteNrc/:id')
  deleteNrc(@Param('id') id: string) {
    return this.adminService.deleteNrc(Number(id));
  }
}
