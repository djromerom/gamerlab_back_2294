import { Module } from '@nestjs/common';
import { EquipoModule } from './equipo/equipo.module';
import { VideojuegoModule } from './videojuego/videojuego.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EquipoModule, 
    VideojuegoModule, 
    EstudianteModule,
    TypeOrmModule.forRoot({}),
  ],
  providers: [],
})
export class AppModule {}
