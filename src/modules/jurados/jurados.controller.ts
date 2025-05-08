import { Controller, Get, Post, Param } from '@nestjs/common';
import { JuradosService } from './jurados.service';

@Controller('jurados')
export class JuradosController {
  constructor(private juradosService: JuradosService) {}

  @Get('confirmar/:token')
  async confirmarJurado(@Param('token') token: string) {
    await this.juradosService.confirmarJurado(token);
    return { message: 'Jurado confirmado exitosamente' };
  }

  @Get('evaluaciones')
  getEvaluaciones(juradoId: number) {
    return this.juradosService.getEvaluaciones(juradoId);
  }

  @Post(':id/reenviar-invitacion')
  reenviarInvitacion(@Param('id') id: string) {
    return this.juradosService.reenviarInvitacion(Number(id));
  }

  @Get(':id/estadisticas')
  getEstadisticas(@Param('id') id: string) {
    return this.juradosService.getEstadisticasJurado(Number(id));
  }
}
