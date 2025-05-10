import { Module } from '@nestjs/common';
import { AdminNrcController } from './adminNrc.controller';
import { AdminNrcService } from './adminNrc.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminNrcController],
  providers: [AdminNrcService],
  exports: [],
})
export class AdminNrcModule {}