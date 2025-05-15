import { Module } from '@nestjs/common';
import { EquipoModule } from './modules/equipo/equipo.module';
import { VideojuegoModule } from './modules/videojuego/videojuego.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './modules/storage/storage.module'
import { JuradoModule } from './modules/jurado/jurado.module';

import { EvaluacionModule } from './modules/evaluacion/evaluacion.module'
import { ReportsModule } from './modules/reports/reports.module';
import { CriterioModule } from './modules/Admin/criterio/criterio.module';
import { AdminNrcModule } from './modules/Admin/nrc/adminNrc.module';
import { MateriaModule } from './modules/Admin/materia/materia.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './common/mail.module';
import { AnalyticsModule } from './modules/Admin/analytics/analytics.module';
import { PanelModule } from './modules/Admin/Panel/panel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    EvaluacionModule,
    EquipoModule, 
    VideojuegoModule, 
    StorageModule,
    JuradoModule,
    ReportsModule,
    CriterioModule,
    AdminNrcModule,
    MateriaModule,
    AuthModule,
    UsersModule,
    MailModule,
    AnalyticsModule,
    PanelModule,
  ],
  providers: [], 
})
export class AppModule {}
