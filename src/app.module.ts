import { Module } from '@nestjs/common';
import { EquipoModule } from './equipo/equipo.module';
import { VideojuegoModule } from './videojuego/videojuego.module';
import { EstudianteModule } from './estudiante/estudiante.module';

@Module({
  imports: [EquipoModule, VideojuegoModule, EstudianteModule],
  providers: [],
})
export class AppModule {}
