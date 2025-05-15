import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { VideojuegoFilter } from './dto/videojuego-filter.dto';
import { WorksheetFilter } from './dto/workbook-filter.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('ratings')
  async getAverageRatings(@Query() filter: VideojuegoFilter) {
    const result = await this.reportsService.getAverageRatings(filter);

    return result.map((v) => {
      return { ...v, average: v.average.toNumber() };
    });
  }

  @Get('ratings/export/worksheet')
  async exportRatingsWorksheet(@Query() filter: WorksheetFilter) {
    const wb = await this.reportsService.getAverageRatingsWorkbook(filter);

    return new StreamableFile(await wb.writeToBuffer(), {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename="Ratings.xlsx"',
    });
  }
}
