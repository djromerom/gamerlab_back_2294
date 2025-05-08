import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // descomentar cuando ya este el auth
// import { AuthenticatedRequest } from 'src/auth/types'; // descomentar si se definen tipos personalizados

@Controller('evaluaciones')
// @UseGuards(JwtAuthGuard, RolesGuard))
// @Roles('jurado')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  // Listar videojuegos asignados al jurado (no evaluados)
  @Get('asignadas')
  async getVideojuegosAsignados(@Req() req /*: AuthenticatedRequest */) {
    const juradoId = req.user?.id || 1; // reemplazar por req.user.id si el JWT esta activo
    return this.evaluacionService.getVideojuegosAsignados(juradoId);
  }

  // Listar evaluaciones ya realizadas
  @Get('realizadas')
  async getEvaluacionesHechas(@Req() req /*: AuthenticatedRequest */) {
    const juradoId = req.user?.id || 1;
    return this.evaluacionService.getEvaluacionesHechas(juradoId);
  }

  @Get(':id')
async getEvaluacionPorId(@Param('id') id: string) {
  return this.evaluacionService.getEvaluacionPorId(Number(id));
}

// evaluacion.controller.ts
@Get('videojuego/:id')
async getEvaluacionesPorVideojuego(@Param('id') id: string) {
  return this.evaluacionService.getEvaluacionesPorVideojuego(Number(id));
}


  // Crear nueva evaluación para un videojuego asignado
  @Post(':videojuegoId')
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