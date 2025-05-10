import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsuariosService } from './users.service';
import { UsuariosController } from './users.controller';



@Module({
imports: [PrismaModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],

})
export class UsersModule {}