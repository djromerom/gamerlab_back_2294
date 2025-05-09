import { Module } from '@nestjs/common';
import { JuradoService } from './jurado.service';
import { JuradoController } from './jurado.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [JuradoController],
  providers: [JuradoService, ValidationExitsService],
  exports: [JuradoService]
})
export class JuradoModule {}