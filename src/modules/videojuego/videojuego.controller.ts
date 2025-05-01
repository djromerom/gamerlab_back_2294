import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { VideojuegoService } from './videojuego.service';
import { CreateVideojuegoDto } from './dto/create-videojuego.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuego.dto';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { VideoJuegoEntity } from './entities/videojuego.entity';

@Controller('videojuego')
export class VideojuegoController {
  constructor(private readonly videojuegoService: VideojuegoService) {}

  @Post()
  @ApiCreatedResponse({ type: VideoJuegoEntity, description: 'Videojuego created successfully.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Videojuego already exists.' })
  create(@Body() createVideojuegoDto: CreateVideojuegoDto) {
    return this.videojuegoService.create(createVideojuegoDto);
  }

  @Get()
  @ApiOkResponse({ description: 'List of videojuegos retrieved successfully.', type: VideoJuegoEntity, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  findAll() {
    return this.videojuegoService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Videojuego found.', type: VideoJuegoEntity })
  @ApiNotFoundResponse({ description: 'Videojuego not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid ID provided.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID format.' })
  findOne(@Param('id') id: number) {
    return this.videojuegoService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Videojuego updated successfully.', type: VideoJuegoEntity })
  @ApiNotFoundResponse({ description: 'Videojuego not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid data provided.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID format.' })
  update(@Param('id') id: number, @Body() updateVideojuegoDto: UpdateVideojuegoDto) {
    return this.videojuegoService.update(id, updateVideojuegoDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Videojuego not found.' })
  @ApiOkResponse({ description: 'Videojuego deleted successfully.', type: VideoJuegoEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Videojuego cannot be deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized action.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID format.' })
  remove(@Param('id') id: number) {
    return this.videojuegoService.remove(id);
  }
}
