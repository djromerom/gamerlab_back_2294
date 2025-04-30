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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
  ],
  providers: [],
})
export class AppModule {}
