import { Controller, Get, Post, Param, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CriterioService } from './criterio.service';
import { CreateCriterioDto } from './dto/create-criterio.dto';
import { UpdateCriterioDto } from './dto/update-criterio.dto';


@Controller('criterios')
export class CriterioController {
  constructor(private readonly criterioService: CriterioService) {}

  @Post()
  create(@Body() data: CreateCriterioDto) {
    return this.criterioService.createCriterio(data);
  }

  @Get()
  findAll() {
    return this.criterioService.getCriterios();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.criterioService.getCriterioById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCriterioDto) {
    return this.criterioService.updateCriterio(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.criterioService.deleteCriterio(id);
  }
}

