import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
const criterios = [
  ['Innovación', 'Qué tan novedoso es'],
  ['Jugabilidad', 'Facilidad de juego'],
  ['Interfaz', 'Calidad de la interfaz'],
  ['Rendimiento', 'Rendimiento y estabilidad'],
  ['Historia', 'Narrativa del juego'],
  ['Diseño', 'Atractivo visual'],
];

for (const [nombre, descripcion] of criterios) {
  await prisma.criterio.create({
    data: { nombre, descripcion },
  });
}
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
