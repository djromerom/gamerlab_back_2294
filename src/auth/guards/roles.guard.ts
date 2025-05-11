import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const { user, route, method } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    // Buscar el endpoint en la base de datos
    const endpoint = await this.prisma.endpoint.findFirst({
      where: {
        nombre: route.path,
        metodo: method,
        deleted: false,
        roles: {
          some: {
            deleted: false,
            rol: {
              nombre: {
                in: user.roles
              }
            }
          }
        }
      }
    });

    return !!endpoint;
  }
}