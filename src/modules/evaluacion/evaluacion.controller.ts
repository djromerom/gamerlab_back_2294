import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { EvaluacionEntity } from './entities/evaluacion.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Evaluaciones')
@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Get('asignadas/:juradoId')
  @ApiResponse({
    status: 200,
    description:
      'Videojuegos asignados aun jurado (por calificar y calificados)',
  })
  async getVideojuegosAsignados(@Param('juradoId') juradoId: string) {
    return this.evaluacionService.getVideojuegosAsignados(Number(juradoId));
  }

  @Get('realizadas/:juradoId')
  @ApiResponse({
    status: 200,
    description: 'Evaluaciones realizadas por un jurado',
    type: [EvaluacionEntity],
  })
  async getEvaluacionesHechas(@Param('juradoId') juradoId: string) {
    return this.evaluacionService.getEvaluacionesHechas(Number(juradoId));
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Detalle de evaluación de un videojuego',
    type: EvaluacionEntity,
  })
  async getEvaluacionPorId(@Param('id') id: string) {
    return this.evaluacionService.getEvaluacionPorId(Number(id));
  }

  @Get('notaVideojuego/:videojuegoId/:juradoId')
  async getEvaluacionesPorVideojuego(
    @Param('id') id: string,
    @Param('juradoId') juradoId: string,
  ) {
    return this.evaluacionService.getEvaluacionesPorVideojuego(
      Number(id),
      Number(juradoId),
    );
  }

  @Get('infoVideojuego/:videojuegoId')
  @ApiResponse({
    status: 200,
    description: 'Obtener toda la info de un videojuego por ID',
  })
  async getVideojuegoPorId(@Param('id') id: string) {
    return this.evaluacionService.getVideojuegoPorId(Number(id));
  }

  @Post('evaluar/:videojuegoId/:juradoId')
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada',
    type: EvaluacionEntity,
  })
  async crearEvaluacion(
    @Param('videojuegoId') videojuegoId: string,
    @Param('juradoId') juradoId: string,
    @Body() dto: CreateEvaluacionDto,
  ) {
    return this.evaluacionService.crearEvaluacion(
      Number(juradoId),
      Number(videojuegoId),
      dto,
    );
  }
}
