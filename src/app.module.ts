import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { EvaluacionModule } from './modules/evaluacion/evaluacion.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EvaluacionModule,
  ],
  providers: [],
})
export class AppModule {}
