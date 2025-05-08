import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

function getRatingsQuery(videojuegos?: number[]) {
  const idCheck = videojuegos
    ? Prisma.sql`AND vg.id IN (${Prisma.join(videojuegos)})`
    : Prisma.empty;

  return Prisma.sql`SELECT
	vg.id id,
	cr.nombre criterio,
	AVG(rb.valoracion) average
FROM
	rubrica rb
	JOIN criterio cr
		ON rb.id_criterio = cr.id
	JOIN evaluacion ev
		ON rb.id_evaluacion = ev.id
	JOIN videojuego vg
		ON ev.videojuego_id = vg.id
WHERE
	rb.deleted = false
	AND cr.deleted = false
	AND ev.deleted = false
	AND vg.deleted = false
	${idCheck}
GROUP BY
	vg.id,
	cr.nombre`;
}

export interface RatingRow {
  id: number;
  criterio: string;
  average: number;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  getAverageRatings(videojuegos?: number[]): Promise<RatingRow[]> {
    return this.prismaService.$queryRaw<RatingRow[]>(
      getRatingsQuery(videojuegos),
    );
  }
}
