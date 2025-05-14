import { PrismaClient, Tipo } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear endpoints básicos
  const endpoints = [
    {
      nombre: '/auth/login',
      metodo: Tipo.POST,
      num_parametros: 2 // email, password
    },
    {
      nombre: '/auth/logout',
      metodo: Tipo.POST, 
      num_parametros: 0
    },
    {
      nombre: '/equipo',
      metodo: Tipo.POST,
      num_parametros: 2 // nombre_equipo, url_logo
    },
    {
      nombre: '/equipo/:id/add-integrante',
      metodo: Tipo.POST,
      num_parametros: 2 // id, array de estudiantes
    },
    {
      nombre: '/equipo/confirmar',
      metodo: Tipo.GET,
      num_parametros: 1 // token
    },
    {
      nombre: '/equipo/estudiante-by-token',
      metodo: Tipo.GET, 
      num_parametros: 1 // token
    },
    {
      nombre: '/equipo',
      metodo: Tipo.GET,
      num_parametros: 3 // limit, materiaId, codigoNrc (opcionales)
    },
    {
      nombre: '/equipo/:id',
      metodo: Tipo.GET,
      num_parametros: 1 // id
    },
    {
      nombre: '/equipo/:id',
      metodo: Tipo.PATCH,
      num_parametros: 2 // id, data
    },
    {
      nombre: '/estudiante/invalidar-token',
      metodo: Tipo.POST,
      num_parametros: 1 // token
    },
    {
      nombre: '/jurado',
      metodo: Tipo.POST,
      num_parametros: 2 // createJuradoDto
    },
    {
      nombre: '/jurado',
      metodo: Tipo.GET,
      num_parametros: 0
    },
    {
      nombre: '/jurado/:id',
      metodo: Tipo.GET,
      num_parametros: 1
    },
    {
      nombre: '/jurado/confirmar/:token',
      metodo: Tipo.GET,
      num_parametros: 1
    },
    {
      nombre: '/jurado/:id/reenviar-invitacion',
      metodo: Tipo.PATCH,
      num_parametros: 1
    },
    {
      nombre: '/jurado/:id/asignar-videojuego/:videojuegoId',
      metodo: Tipo.POST,
      num_parametros: 2
    },
    {
      nombre: '/jurado/:id/eliminar-asignacion/:videojuegoId',
      metodo: Tipo.DELETE,
      num_parametros: 2
    },
    {
      nombre: '/evaluaciones/asignadas',
      metodo: Tipo.GET,
      num_parametros: 0
    },
    {
      nombre: '/evaluaciones/realizadas',
      metodo: Tipo.GET,
      num_parametros: 0
    },
    {
      nombre: '/evaluaciones/:id',
      metodo: Tipo.GET,
      num_parametros: 1
    },
    {
      nombre: '/evaluaciones/videojuego/:id',
      metodo: Tipo.GET,
      num_parametros: 1
    },
    {
      nombre: '/evaluaciones/:videojuegoId',
      metodo: Tipo.POST,
      num_parametros: 2 // videojuegoId, createEvaluacionDto
    },
    {
      nombre: '/videojuego',
      metodo: Tipo.POST,
      num_parametros: 3 // nombre, descripcion, equipo_id
    },
    {
      nombre: '/videojuego',
      metodo: Tipo.GET,
      num_parametros: 2 // limit, equipo_id (opcionales)
    },
    {
      nombre: '/videojuego/:id',
      metodo: Tipo.GET,
      num_parametros: 1
    },
    {
      nombre: '/videojuego/:id',
      metodo: Tipo.PATCH,
      num_parametros: 2 // id, updateData
    },
    {
      nombre: '/criterios',
      metodo: Tipo.POST,
      num_parametros: 2 // nombre, descripcion
    },
    {
      nombre: '/criterios',
      metodo: Tipo.GET,
      num_parametros: 0
    },
    {
      nombre: '/criterios/:id',
      metodo: Tipo.GET,
      num_parametros: 1
    },
    {
      nombre: '/criterios/:id',
      metodo: Tipo.PATCH,
      num_parametros: 2
    },
    {
      nombre: '/criterios/:id',
      metodo: Tipo.DELETE,
      num_parametros: 1
    },
    {
      nombre: '/admin/createNrc',
      metodo: Tipo.POST,
      num_parametros: 3
    },
    {
      nombre: '/admin/getNrcs',
      metodo: Tipo.GET,  
      num_parametros: 0
    },
    {
      nombre: '/admin/getNrcById/:id',
      metodo: Tipo.GET,
      num_parametros: 1
    },
    {
      nombre: '/admin/getNrcByMateria/:materiaId',
      metodo: Tipo.GET,
      num_parametros: 1
    },
    {
      nombre: '/admin/updateNrc/:id',
      metodo: Tipo.PUT,
      num_parametros: 2
    },
    {
      nombre: '/admin/deleteNrc/:id',
      metodo: Tipo.DELETE,
      num_parametros: 1
    },
  ];

  // Crear roles
  const roles = [
    {
      nombre: 'ADMIN',
    },
    {
      nombre: 'ESTUDIANTE',
    },
    {
      nombre: 'JURADO',
    },
    {
      nombre: 'PROFESOR',
    }
  ];

  // Crear endpoints
  for (const endpoint of endpoints) {
    await prisma.endpoint.create({
      data: endpoint
    });
  }

  // Crear roles y asignar endpoints
  for (const role of roles) {
    const createdRole = await prisma.rol.create({
      data: {
        nombre: role.nombre
      }
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });