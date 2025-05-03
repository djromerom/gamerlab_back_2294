import { Module } from '@nestjs/common';
import { EquipoModule } from './modules/equipo/equipo.module';
import { VideojuegoModule } from './modules/videojuego/videojuego.module';

@Module({
  imports: [
    EquipoModule, 
    VideojuegoModule, 
  ],
  providers: [],
})
export class AppModule {}
