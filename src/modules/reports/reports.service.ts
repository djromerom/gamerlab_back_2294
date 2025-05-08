import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import excel from 'excel4node';

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

type GameName = {
  id: number;
  nombre_videojuego: string;
};

export interface RatingRow {
  id: number;
  criterio: string;
  average: number;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  private getAverageRatingsByIds(videojuegos?: number[]) {
    return this.prismaService.$queryRaw<RatingRow[]>(
      getRatingsQuery(videojuegos),
    );
  }

  private getGameNames(videojuegos?: number[]) {
    return this.prismaService.videojuego.findMany({
      where: {
        id: {
          in: videojuegos,
        },
      },
      select: {
        id: true,
        nombre_videojuego: true,
      },
    });
  }

  getAverageRatings(videojuegos?: number[]): Promise<RatingRow[]> {
    return this.getAverageRatingsByIds(videojuegos);
  }

  private asWorkbook(names: GameName[], ratings: RatingRow[]) {
    const idMap = new Map(names.map((g) => [g.id, g.nombre_videojuego]));

    // Each row has a videogame, columns have criteria
    const rowMap = new Map<number, number>();
    const columnMap = new Map<string, number>();

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Promedios');

    // Initialize ID & name columns
    worksheet.cell(1, 1).string('#');
    worksheet.cell(1, 2).string('Nombre');

    let currentRow = 1;
    let currentColumn = 2;

    for (const rating of ratings) {
      let row = rowMap.get(rating.id);
      if (row === undefined) {
        row = ++currentRow;
        rowMap.set(rating.id, row);

        worksheet.cell(row, 1).number(rating.id);
        worksheet.cell(row, 2).string(idMap.get(rating.id)!);
      }

      let column = columnMap.get(rating.criterio);
      if (column === undefined) {
        column = ++currentColumn;
        columnMap.set(rating.criterio, column);
      }

      worksheet.cell(row, column).number(rating.average);
    }

    return workbook;
  }

  async getAverageRatingsWorkbook(videojuegos?: number[]) {
    const [names, ratings] = await this.prismaService.$transaction([
      this.getGameNames(videojuegos),
      this.getAverageRatingsByIds(videojuegos),
    ]);

    return this.asWorkbook(names, ratings);
  }
}
