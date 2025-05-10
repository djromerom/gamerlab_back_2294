import { Module } from '@nestjs/common';
import { CriterioService } from './criterio.service';
import { CriterioController } from './criterio.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],  
  controllers: [CriterioController],
  providers: [CriterioService],
})
export class CriterioModule {}