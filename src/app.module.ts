import { Module } from '@nestjs/common';
import { EquipoModule } from './modules/equipo/equipo.module';
import { VideojuegoModule } from './modules/videojuego/videojuego.module';
import { EstudianteModule } from './modules/estudiante/estudiante.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [EquipoModule, VideojuegoModule, EstudianteModule, ReportsModule],
  providers: [],
})
export class AppModule {}
