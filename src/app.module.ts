import { Module } from '@nestjs/common';
import { EquipoModule } from './modules/equipo/equipo.module';
import { VideojuegoModule } from './modules/videojuego/videojuego.module';
import { ConfigModule } from '@nestjs/config';
import { EstudianteModule } from './modules/estudiante/estudiante.module';
import { MateriaModule } from './modules/materia/materia.module';
import { NrcModule } from './modules/nrc/nrc.module';
// import { StorageModule } from './modules/storage/storage.module'
import { JuradoModule } from './modules/jurado/jurado.module';
import { EvaluacionModule } from './modules/evaluacion/evaluacion.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EvaluacionModule,
    EquipoModule, 
    VideojuegoModule, 
    EstudianteModule,
    MateriaModule, 
    NrcModule,
    // StorageModule, // Keep this commented if you're having issues with Supabase
    JuradoModule,
  ],
  providers: [], 
})
export class AppModule {}