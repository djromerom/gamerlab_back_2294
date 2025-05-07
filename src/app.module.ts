import { Module } from '@nestjs/common';
import { EquipoModule } from './modules/equipo/equipo.module';
import { VideojuegoModule } from './modules/videojuego/videojuego.module';
import { ConfigModule } from '@nestjs/config'
import { EstudianteModule } from './modules/estudiante/estudiante.module';
import { MateriaModule } from './modules/materia/materia.module';
import { NrcModule } from './modules/nrc/nrc.module';
import { StorageModule } from './modules/storage/storage.module'
import { JuradosModule } from './modules/jurados/jurados.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EquipoModule, 
    VideojuegoModule, 
    EstudianteModule,
    MateriaModule,
    NrcModule,
    JuradosModule
  ],
  providers: [],
})
export class AppModule {}
