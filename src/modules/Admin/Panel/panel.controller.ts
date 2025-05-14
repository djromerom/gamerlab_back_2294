import { Controller, Get } from '@nestjs/common';
import { PanelService } from './panel.service';

@Controller('panel')
export class PanelController {
  constructor(private panelService: PanelService) {}

  // 🖥️ Contar equipos confirmados
  @Get('count-equipos')
  getCountEquipos() {
    return this.panelService.getCountEquipos();
  }

  // 🎮 Contar videojuegos
  @Get('count-videojuegos')
  getCountVideojuegos() {
    return this.panelService.getCountVideojuegos();
  }

  // 📊 Contar evaluaciones hechas
  @Get('count-evaluaciones-hechas')
  getCountEvaluacionesHechas() {
    return this.panelService.getCountEvaluacionesHechas();
  }

  // 📈 Promedio global de evaluaciones
  @Get('promedio-global')
  getPromedioGlobal() {
    return this.panelService.getPromedioGlobal();
  }

  // ❌ Videojuegos sin evaluaciones
  @Get('sin-calificar')
  getSinCalificar() {
    return this.panelService.getSinCalificar();
  }

  // 💤 Jurados inactivos
  @Get('jurados-inactivos')
  getJuradosInactivos() {
    return this.panelService.getJuradosInactivos();
  }

  // 📝 Equipos con registro incompleto
  @Get('equipos-registro-incompleto')
  getEquiposRegistroIncompleto() {
    return this.panelService.getEquiposRegistroIncompleto();
  }
}

