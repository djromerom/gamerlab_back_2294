import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, SerializeOptions, ClassSerializerInterceptor, UseInterceptors, HttpException } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { EquipoEntity } from './entities/equipo.entity';
import { EstudianteEntity } from '../estudiante/entities/estudiante.entity';
import { EstudianteService } from '../estudiante/estudiante.service';
import { CreateEstudianteDto } from '../estudiante/dto/create-estudiante.dto';
import { ConfirmEstudianteDto } from '../estudiante/dto/confirm-estudiante.dto';
import { Estado } from '@prisma/client';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from 'src/auth/guards/auth.guard';


@Public()
@Controller('equipo')
@UseInterceptors(ClassSerializerInterceptor)
export class EquipoController {
  constructor(
    private readonly equipoService: EquipoService, 
    private readonly estudianteService: EstudianteService,
    private readonly prisma: PrismaService 
  ) {}
  @SerializeOptions({ type: EquipoEntity })
  @Post()
  @ApiCreatedResponse({ type: EquipoEntity, description: 'Equipo created successfully.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Equipo already exists.' })
  create(@Body() createEquipoDto: CreateEquipoDto) {
    return this.equipoService.create(createEquipoDto);
  }

  @Post(':id/add-integrante')
  @SerializeOptions({ type: EstudianteEntity })
  @ApiCreatedResponse({ type: EstudianteEntity, description: 'Estudiantes added successfully.', isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Equipo already exists.' })
  @ApiNotFoundResponse({ description: 'Equipo not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid ID provided.' })
  @ApiBody({ type: CreateEstudianteDto, isArray: true })
  createEstudiante(@Param('id') id: number, @Body() createEstudianteDto: CreateEstudianteDto[]) {
    return this.estudianteService.createMany(id, createEstudianteDto);
  }

  @Get('confirmar')
  @ApiOperation({ summary: 'Confirmar registro de estudiante mediante token' })
  @ApiQuery({ name: 'token', required: true, type: String })
  async confirmRegistro(
    @Query('token') token: string,
    @Res() response: Response
  ) {
    try {
      const estudiante = await this.estudianteService.confirmarEstudiante(token);

      if (estudiante.equipo_id !== undefined) {
        this.equipoService.updateEstado(estudiante.equipo_id, Estado.Inscrito_confirmado);

        const allConfirmados = await this.equipoService.allEstudiantesConfirmados(estudiante.equipo_id);
        if (allConfirmados) {
          this.equipoService.updateEstado(estudiante.equipo_id, Estado.Inscripcion_completa);
        }
      } else {
        throw new HttpException('El estudiante no tiene un equipo asignado', HttpStatus.BAD_REQUEST);
      }

      // Redirigir al frontend con el token como parámetro
      return response.redirect(302, `http://localhost:3001/confirmar-registro?token=${token}`);
    } catch (error) {
      // Redirigir a una página de error
      return response.redirect(302, `http://localhost:3001/confirmar-registro?error=${encodeURIComponent(error.message)}`);
    }
  }

  @Get('estudiante-by-token')
  @ApiOperation({ summary: 'Obtener información de un estudiante por su token' })
  @ApiQuery({ name: 'token', required: true, type: String })
  async getEstudianteByToken(@Query('token') token: string) {
    try {
      // Buscar estudiante por token sin confirmar
      const estudiante = await this.prisma.estudiante.findFirst({
        where: {
          token_confirmacion: token,
          deleted: false,
        },
        select: {
          id: true,
          confirmado: true,
          github: true,
          equipo_id: true,
          usuario: {
            select: {
              nombre_completo: true,
              email: true,
            },
          },
          equipo: {
            select: {
              id: true,
              nombre_equipo: true,
            },
          },
        },
      });

      if (!estudiante) {
        throw new HttpException('Estudiante no encontrado', HttpStatus.NOT_FOUND);
      }

      return estudiante;
    } catch (error) {
      throw new HttpException(error.message || 'Error al obtener estudiante', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @SerializeOptions({ type: EquipoEntity })
  @Get('')
  @ApiOkResponse({ description: 'List of equipos.', type: EquipoEntity, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit of equipos to return.' })
  @ApiQuery({ name: 'materiaId', required: false, type: Number, description: 'Filter equipos by materia ID.' })
  @ApiQuery({ name: 'codigoNrc', required: false, type: Number, description: 'Filter equipos by NRC code.' })
  findAll(@Query('limit') limit?: number, @Query('materiaId') materiaId?: number, @Query('codigoNrc') codigoNrc?: number): Promise<EquipoEntity[]> {
    return this.equipoService.findAll(limit, materiaId, codigoNrc);
  }

  @SerializeOptions({ type: EquipoEntity })
  @Get(':id')
  @ApiOkResponse({ description: 'Equipo found.', type: EquipoEntity })
  @ApiNotFoundResponse({ description: 'Equipo not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid ID provided.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  findOne(@Param('id') id: number) {
    return this.equipoService.findOne(id);
  }

  @SerializeOptions({ type: EquipoEntity })
  @Patch(':id')
  @ApiOkResponse({ description: 'Equipo updated successfully.', type: EquipoEntity })
  @ApiNotFoundResponse({ description: 'Equipo not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data provided.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  update(@Param('id') id: number, @Body() updateEquipoDto: UpdateEquipoDto) {
    return this.equipoService.update(id, updateEquipoDto);
  }


  
  /* @Delete(':id')
  @ApiNotFoundResponse({ description: 'Equipo not found.' })
  @ApiOkResponse({ description: 'Equipo deleted successfully.', type: EquipoEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Equipo cannot be deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  remove(@Param('id') id: number) {
    return this.equipoService.remove(id);
  } */
}
