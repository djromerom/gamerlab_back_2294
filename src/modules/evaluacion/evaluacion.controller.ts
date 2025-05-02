import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';

@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Get('asignadas')
  async getVideojuegosAsignados(@Req() req) {
    const juradoId = 1;
    return this.evaluacionService.getVideojuegosAsignados(juradoId);
  }

  @Post(':videojuegoId')
  async crearEvaluacion(
    @Param('videojuegoId') videojuegoId: number,
    @Req() req,
    @Body() dto: CreateEvaluacionDto,
  ) {
    const juradoId = req.user.id;
    return this.evaluacionService.crearEvaluacion(juradoId, videojuegoId, dto);
  }
}
