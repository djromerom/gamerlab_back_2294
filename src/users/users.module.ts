import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsuariosService } from './users.service';
import { UsuariosController } from './users.controller';
import { PasswordService } from 'src/common/services/password.service';



@Module({
imports: [PrismaModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, PasswordService],

})
export class UsersModule {}