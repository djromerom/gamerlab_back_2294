import { Module } from '@nestjs/common';
import { EquipoModule } from './modules/equipo/equipo.module';
import { VideojuegoModule } from './modules/videojuego/videojuego.module';
import { EstudianteModule } from './modules/estudiante/estudiante.module';
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    EquipoModule, 
    VideojuegoModule, 
    EstudianteModule,
  ],
  providers: [],
})
export class AppModule {}
