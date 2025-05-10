import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EstudianteService } from './estudiante.service';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post('invalidar-token')
  @ApiOperation({ summary: 'Invalidar token de confirmación de estudiante' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token invalidado exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Estudiante no encontrado.' })
  async invalidarToken(@Body() data: { token: string }) {
    return this.estudianteService.invalidarToken(data.token);
  }
}