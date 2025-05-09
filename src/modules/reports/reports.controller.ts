import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { VideojuegoFilter } from './dto/videojuego-filter.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('ratings')
  async getAverageRatings(@Query() filter: VideojuegoFilter) {
    const result = await this.reportsService.getAverageRatings(
      filter.videojuegos,
    );

    return result.map((v) => {
      return { ...v, average: v.average.toNumber() };
    });
  }

  @Get('ratings/export/worksheet')
  async exportRatingsWorksheet(@Query() filter: VideojuegoFilter) {
    const wb = await this.reportsService.getAverageRatingsWorkbook(
      filter.videojuegos,
    );
    return new StreamableFile(await wb.writeToBuffer());
  }
}
