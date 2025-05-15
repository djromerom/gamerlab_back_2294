import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as excel from 'excel4node';
import { Decimal } from '@prisma/client/runtime/library';
import { VideojuegoFilter } from './dto/videojuego-filter.dto';
import { WorksheetFilter, WorksheetViewType } from './dto/workbook-filter.dto';

function makeSearchFilter(search: string) {
  return Prisma.sql`AND (
	POSITION(LOWER(${search}) in LOWER(mat.nombre)) > 0
	OR POSITION(LOWER(${search}) in LOWER(nrc.codigo_nrc::text)) > 0
	OR POSITION(LOWER(${search}) in LOWER(vg.nombre_videojuego)) > 0
	OR POSITION(LOWER(${search}) in LOWER(us.nombre_completo)) > 0
)`;
}

function getRatingsQuery(filter: VideojuegoFilter) {
  const idCheck = filter.videojuegos
    ? Prisma.sql`AND vg.id IN (${Prisma.join(filter.videojuegos)})`
    : Prisma.empty;

  const searchFilter = filter.search
    ? makeSearchFilter(filter.search)
    : Prisma.empty;

  return Prisma.sql`SELECT
	vg.id id
	,vg.nombre_videojuego name
	,us.nombre_completo jurado
	,mat.nombre materia
	,nrc.comdigo_nrc nrc
	,cr.nombre criterio
	,AVG(rb.valoracion) average
FROM
	"Rubrica" rb
	JOIN "Criterio" cr
		ON rb.id_criterio = cr.id
	JOIN "Evaluacion" ev
		ON rb.id_evaluacion = ev.id
	JOIN "Videojuego" vg
		ON ev.videojuego_id = vg.id
	JOIN "Jurado" ju
		ON ev.jurado_id = ju.id
	JOIN "Usuario" us
		ON ju.id_user = us.id
	JOIN "NRC" nrc
		ON us.id = nrc.profesor_id
	JOIN "Materia" mat
		ON nrc.materia_id = mat.id
WHERE
	rb.deleted = false
	AND cr.deleted = false
	AND ev.deleted = false
	AND vg.deleted = false
	AND us.deleted = false ${searchFilter} ${idCheck}
GROUP BY
	vg.id
	,cr.nombre
	,vg.nombre_videojuego name
	,us.nombre_completo`;
}

export interface RatingRow {
  id: number;
  name: string;
  jurado: string;
  materia: string;
  nrc: number;
  criterio: string;
  average: Decimal;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  getAverageRatings(filter: VideojuegoFilter): Promise<RatingRow[]> {
    return this.prismaService.$queryRaw<RatingRow[]>(
      getRatingsQuery(filter),
    );
  }

  private asWorkbook(view: WorksheetViewType, ratings: RatingRow[]) {
    // Each row has a videogame, columns have criteria
    const rowMap = new Map<number, number>();
    const columnMap = new Map<string, number>();

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Promedios');

    // Initialize ID & name columns
    const isByName = view === WorksheetViewType.ByName;
    worksheet.cell(1, 1).string(isByName ? '#' : 'Juego');
    worksheet.cell(1, 2).string(isByName ? 'Nombre' : 'Jurado');

    let currentRow = 1;
    let currentColumn = 2;

    for (const rating of ratings) {
      let row = rowMap.get(rating.id);
      if (row === undefined) {
        row = ++currentRow;
        rowMap.set(rating.id, row);

        worksheet.cell(row, 1).string(isByName ? rating.id.toString() : rating.name);
        worksheet.cell(row, 2).string(isByName ? rating.name : rating.jurado);
      }

      let column = columnMap.get(rating.criterio);
      if (column === undefined) {
        column = ++currentColumn;
        columnMap.set(rating.criterio, column);

        worksheet.cell(1, column).string(rating.criterio);
      }

      worksheet.cell(row, column).number(rating.average.toNumber());
    }

    return workbook;
  }

  async getAverageRatingsWorkbook(filter: WorksheetFilter) {
    const vgf = new VideojuegoFilter();
    if (filter.view === WorksheetViewType.ByJurado) {
      vgf.videojuegos = filter.videojuegos?.slice(0,1);
    } else {
      vgf.videojuegos = filter.videojuegos;
    }

    const ratings = await this.getAverageRatings(vgf);

    return this.asWorkbook(filter.view, ratings);
  }
}
