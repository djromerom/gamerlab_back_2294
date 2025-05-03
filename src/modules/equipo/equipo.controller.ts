import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { EquipoEntity } from './entities/equipo.entity';
import { EstudianteEntity } from '../estudiante/entities/estudiante.entity';
import { EstudianteService } from '../estudiante/estudiante.service';
import { CreateEstudianteDto } from '../estudiante/dto/create-estudiante.dto';

@Controller('equipo')
export class EquipoController {
  constructor(private readonly equipoService: EquipoService, private readonly estudianteService: EstudianteService) {}

  @Post()
  @ApiCreatedResponse({ type: EquipoEntity, description: 'Equipo created successfully.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Equipo already exists.' })
  create(@Body() createEquipoDto: CreateEquipoDto) {
    return this.equipoService.create(createEquipoDto);
  }

  @Post(':id/add-integrante')
  @ApiCreatedResponse({ type: EstudianteEntity , description: 'Estudiantes added successfully.', isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Equipo already exists.' })
  @ApiNotFoundResponse({ description: 'Equipo not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid ID provided.' })
  @ApiBody({ type: CreateEstudianteDto, isArray: true })
  createEstudiante(@Param('id') id: number, @Body() createEstudianteDto: CreateEstudianteDto[]) {
    return this.estudianteService.createMany(id, createEstudianteDto);
  }

  @Get()
  @ApiOkResponse({ description: 'List of equipos.', type: EquipoEntity, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  findAll() {
    return this.equipoService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Equipo found.', type: EquipoEntity })
  @ApiNotFoundResponse({ description: 'Equipo not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid ID provided.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  findOne(@Param('id') id: number) {
    return this.equipoService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Equipo updated successfully.', type: EquipoEntity })
  @ApiNotFoundResponse({ description: 'Equipo not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data provided.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  update(@Param('id') id: number, @Body() updateEquipoDto: UpdateEquipoDto) {
    return this.equipoService.update(id, updateEquipoDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Equipo not found.' })
  @ApiOkResponse({ description: 'Equipo deleted successfully.', type: EquipoEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Equipo cannot be deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  remove(@Param('id') id: number) {
    return this.equipoService.remove(id);
  }
}
