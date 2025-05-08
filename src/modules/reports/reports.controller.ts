import { Controller, Get, ParseArrayPipe, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('ratings')
  getAverageRatings(
    @Query('videojuegos', new ParseArrayPipe({ items: Number, separator: ',' }))
    videojuegos: number[],
  ) {
    return this.reportsService.getAverageRatings(videojuegos);
  }
}
