import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { EvaluacionEntity } from './entities/evaluacion.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { AuthenticatedRequest } from 'src/auth/types';

@ApiTags('Evaluaciones')
@Controller('evaluaciones')
// @UseGuards(JwtAuthGuard, RolesGuard))
// @Roles('jurado')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Get('asignadas')
  @ApiResponse({ status: 200, description: 'Videojuegos asignados' })
  async getVideojuegosAsignados(@Req() req /*: AuthenticatedRequest */) {
    const juradoId = req.user?.id || 1;
    return this.evaluacionService.getVideojuegosAsignados(juradoId);
  }

  @Get('realizadas')
  @ApiResponse({
    status: 200,
    description: 'Evaluaciones realizadas',
    type: [EvaluacionEntity],
  })
  async getEvaluacionesHechas(@Req() req /*: AuthenticatedRequest */) {
    const juradoId = req.user?.id || 1;
    return this.evaluacionService.getEvaluacionesHechas(juradoId);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Detalle de evaluación',
    type: EvaluacionEntity,
  })
  async getEvaluacionPorId(@Param('id') id: string) {
    return this.evaluacionService.getEvaluacionPorId(Number(id));
  }

  @Get('videojuego/:id')
  @ApiResponse({
    status: 200,
    description: 'Evaluaciones de un videojuego',
  })
  async getEvaluacionesPorVideojuego(@Param('id') id: string) {
    return this.evaluacionService.getEvaluacionesPorVideojuego(Number(id));
  }

  @Post(':videojuegoId')
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada',
    type: EvaluacionEntity,
  })
  async crearEvaluacion(
    @Param('videojuegoId') videojuegoId: string,
    @Req() req /*: AuthenticatedRequest */,
    @Body() dto: CreateEvaluacionDto,
  ) {
    const juradoId = req.user?.id || 1;
    return this.evaluacionService.crearEvaluacion(
      juradoId,
      Number(videojuegoId),
      dto,
    );
  }
}
