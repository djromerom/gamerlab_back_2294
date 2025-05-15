import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/common/services/password.service';
import { EmailService } from 'src/modules/email/email.service';

import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private emailService: EmailService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { nombre_completo, email, rol } = createUserDto;
  try {
    const userFound = await this.prismaService.usuario.findUnique({
      where: { email, deleted: false },
    });

    if (userFound) throw new BadRequestException('El usuario ya existe');

    // Aquí ahora el usuario debe enviar contraseña en el signup o generarla y devolverla
    const generatedPassword = await this.passwordService.randomPassword(10);
    const hashedPassword = await this.passwordService.hashPassword(generatedPassword);

    const usuario = await this.prismaService.usuario.create({
      data: {
        nombre_completo,
        email,
        hash_contrasena: hashedPassword,
        // No se usa token_confirmacion
      },
    });

   
    // Generar JWT normalmente
    const { hash_contrasena, ...userWithoutPassword } = usuario;
    const payload = { ...userWithoutPassword };
    const accessToken = await this.jwtService.signAsync({ payload });

    return { accessToken, password: generatedPassword }; // opcional devolver password si la creas aquí
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new Error(error);
  }
}


  async signIn(email: string, password: string) {
  const usuario = await this.prismaService.usuario.findFirst({
  where: { email, deleted: false },
  include: {
    roles: {
      include: {
        rol: true, // 👈 esto permite acceder a `r.rol.nombre`
      },
    },
  },
});


  if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

  // 🚫 Si aún no ha activado la cuenta (aún tiene token)
  if (usuario.token_confirmacion) {
    throw new UnauthorizedException('Debe activar su cuenta primero');
  }

  const passwordValid = await this.passwordService.comparePassword(
    password,
    usuario.hash_contrasena,
  );

  if (!passwordValid) throw new UnauthorizedException('Credenciales inválidas');

  const roles = usuario.roles.map(r => r.rol.nombre); // asumiendo que la relación incluye campo `nombre`
  const payload = {
    sub: usuario.id,
    email: usuario.email,
    roles,
  };

  const token = await this.jwtService.signAsync(payload);
  return { access_token: token };
}


  async validateUser(token: string) {
    return this.prismaService.usuario.findFirst({
      where: { 
        token_confirmacion: token,
        deleted: false 
      },
      include: {
        roles: {
          where: { deleted: false },
          include: {
            rol: {
              select: {
                nombre: true,
              }
            }
          }
        }
      }
    });
  }

  async validateUserById(id: number) {
    try {
      const user = await this.prismaService.usuario.findFirst({
        where: {
          id,
          deleted: false
        },
        include: {
          roles: {
            where: { deleted: false },
            include: {
              rol: {
                select: {
                  nombre: true,
                }
              }
            }
          }
        }
      })
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      return true;

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return false;
      }
      throw new InternalServerErrorException('Error al validar usuario');
    }

  }

  async createPasswordHash( password: string, token: string) {
    const user = await this.validateUser(token);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    await this.prismaService.usuario.update({
      where: { id: user.id },
      data: { hash_contrasena: hashedPassword, token_confirmacion: null },
    });
  }
}

  



