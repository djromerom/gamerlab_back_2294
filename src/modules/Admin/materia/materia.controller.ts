// src/Admin/materia/materia.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MateriasService } from './materia.service'; // Asegúrate de la extensión .service.ts
import { MateriaDTO } from './dto/materia.dto'; // Asegúrate que el DTO está en la carpeta dto

@Controller('materias')
export class MateriasController {
  constructor(private materiasService: MateriasService) {}

  @Post('createMateria')
  createMateria(@Body() data: MateriaDTO) {
    return this.materiasService.createMateria(data);
  }

  @Get('getMaterias')
  getMaterias() {
    return this.materiasService.getMaterias();
  }

  @Get('getMateriaById/:id')
  getMateriaById(@Param('id') id: string) {
    return this.materiasService.getMateriaById(Number(id));
  }

  @Put('updateMateria/:id')
  updateMateria(@Param('id') id: string, @Body() data: MateriaDTO) {
    return this.materiasService.updateMateria(Number(id), data);
  }

  @Delete('deleteMateria/:id')
  deleteMateria(@Param('id') id: string) {
    return this.materiasService.deleteMateria(Number(id));
  }
}