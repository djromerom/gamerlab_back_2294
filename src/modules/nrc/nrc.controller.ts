import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, SerializeOptions, ClassSerializerInterceptor, ParseIntPipe } from '@nestjs/common';
import { NrcService } from './nrc.service';
import { CreateNrcDto } from './dto/create-nrc.dto';
import { UpdateNrcDto } from './dto/update-nrc.dto';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { NrcEntity } from './entities/nrc.entity';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: NrcEntity })
@Controller('nrc')
export class NrcController {
  constructor(private readonly nrcService: NrcService) {}

  @Post()
  @ApiCreatedResponse({ description: 'NRC creado exitosamente', type: NrcEntity })
  create(@Body() createNrcDto: CreateNrcDto) {
    return this.nrcService.create(createNrcDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de NRCs', type: NrcEntity, isArray: true })
  findAll() {
    return this.nrcService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'NRC encontrado', type: NrcEntity })
  @ApiNotFoundResponse({ description: 'NRC no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.nrcService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNrcDto: UpdateNrcDto) {
    return this.nrcService.update(id, updateNrcDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.nrcService.remove(id);
  }
}
