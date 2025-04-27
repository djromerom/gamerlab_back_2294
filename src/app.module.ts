import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EquipoModule } from './equipo/equipo.module';
import { VideojuegoModule } from './videojuego/videojuego.module';
import { EstudianteModule } from './estudiante/estudiante.module';

@Module({
  imports: [EquipoModule, VideojuegoModule, EstudianteModule],
  providers: [AppService],
})
export class AppModule {}
