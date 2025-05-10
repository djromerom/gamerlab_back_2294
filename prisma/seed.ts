import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Usuario jurado
  const usuarioJurado = await prisma.usuario.create({
    data: {
      nombre_completo: 'Laura Jurado',
      email: 'laura@jurado.com',
      hash_contrasena: 'hash123',
    },
  });

  // 2. Jurado
  await prisma.jurado.create({
    data: {
      id_user: usuarioJurado.id,
      estado: 'confirmado',
      token_confirmacion: 'abc123',
      ultima_conexion: new Date(),
    },
  });

  // 3. Usuario profesor y estudiante
  const profesor = await prisma.usuario.create({
    data: {
      nombre_completo: 'Profesor Diseño',
      email: 'profe@uni.com',
      hash_contrasena: 'profhash',
    },
  });

  const estudianteUser = await prisma.usuario.create({
    data: {
      nombre_completo: 'Carlos Estudiante',
      email: 'carlos@uni.com',
      hash_contrasena: 'estuhash',
    },
  });

  // 4. Materia
  const materia = await prisma.materia.create({
    data: {
      nombre: 'Diseño de Software',
      codigo: 'DSW123',
    },
  });

  // 5. NRC
  const nrc = await prisma.nRC.create({
    data: {
      materia_id: materia.id,
      profesor_id: profesor.id,
    },
  });

  // 6. Equipo
  const equipo = await prisma.equipo.create({
    data: {
      nombre_equipo: 'Los Pro Gamers',
      url_logo: 'logo.png',
      estado: 'Inscripcion_completa',
    },
  });

  // 7. Estudiante
  const estudiante = await prisma.estudiante.create({
    data: {
      id_user: estudianteUser.id,
      equipo_id: equipo.id,
      github: 'https://github.com/estudiante1',
      confirmado: true,
    },
  });

  // 8. EstudianteNRC
  await prisma.estudianteNRC.create({
    data: {
      id_estudiante: estudiante.id,
      id_nrc: nrc.codigo_nrc,
    },
  });

  // 9. Videojuego
  const videojuego = await prisma.videojuego.create({
    data: {
      equipo_id: equipo.id,
      nombre_videojuego: 'Super Juego',
      descripcion: 'Un juego increíble',
    },
  });

  // 10. Asignación de videojuego al jurado
  await prisma.videojuegoAsignado.create({
    data: {
      id_jurado: 1,
      id_videojuego: videojuego.id,
    },
  });

  // 11. 6 criterios de evaluación
  const criterios = [
    ['Innovación', 'Qué tan novedoso es'],
    ['Jugabilidad', 'Facilidad de juego'],
    ['Interfaz', 'Calidad de la interfaz de usuario'],
    ['Rendimiento', 'Rendimiento y estabilidad'],
    ['Historia', 'Narrativa del juego'],
    ['Diseño', 'Atractivo visual'],
  ];

  for (const [nombre, descripcion] of criterios) {
    await prisma.criterio.create({
      data: { nombre, descripcion }
    });
  }

  console.log('🎉 Seed completo: datos insertados en Supabase');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

