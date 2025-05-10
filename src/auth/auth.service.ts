import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService,private jwtService: JwtService) {}


  
  async getUsers() {
    return await this.prismaService.usuario.findMany();
  }

  async signUp(nombre_completo: string, email: string, password: string) {
    try {
      const userFound = await this.prismaService.usuario.findUnique({
        where: { email },
      });

      if (userFound) throw new BadRequestException('El usuario ya existe');

      const hashedPassword = await this.hashPassword(password);

      const usuario = await this.prismaService.usuario.create({
        data: {
          nombre_completo,
          email,
          hash_contrasena: hashedPassword,
        },
      });


      const { hash_contrasena, ...userWithoutPassword } = usuario;
      const payload = { ...userWithoutPassword };
      const accessToken = await this.jwtService.signAsync({ payload });

      return {accessToken};

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const user = await this.prismaService.usuario.findUnique({
        where: { email },
      });
  
      if (!user) {
        throw new BadRequestException('Credenciales incorrectas');
      }
  
      const isMatch = await this.compare(password, user.hash_contrasena);
      if (!isMatch) {
        throw new BadRequestException('Credenciales incorrectas');
      }
      const { hash_contrasena, ...userWithoutPassword } = user;
      const payload = { ...userWithoutPassword };
      const accessToken = await this.jwtService.signAsync({ payload });

      return {accessToken};
  
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Error en signIn");
    }
  }
  

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

  



