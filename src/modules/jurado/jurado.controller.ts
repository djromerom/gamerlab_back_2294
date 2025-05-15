import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { JuradoService } from './jurado.service';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';
import { AsignarVideojuegoDto } from './dto/asignar-videojuego.dto';
import { ConfirmarJuradoDto } from './dto/confirmar-Jurado.dto';
import { EvaluacionRealizadaDto } from './dto/evaluacion-realizada.dto';
import { DetalleCriterioEvaluadoDto } from './dto/detalle-evaluacion-criterio.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@ApiTags('Jurado')
@Controller('jurado')
export class JuradoController {
  constructor(private readonly juradoService: JuradoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo jurado' })
  @ApiBody({ type: CreateJuradoDto })
  @ApiCreatedResponse({ description: 'El jurado ha sido creado exitosamente.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos.' })
  @ApiConflictResponse({ description: 'El correo electrónico ya existe.' })
  @ApiForbiddenResponse({ description: 'Forbidden. Rol no autorizado.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  create(@Body() createJuradoDto: CreateJuradoDto) {
    return this.juradoService.create(createJuradoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de todos los jurados (activos)' })
  @ApiOkResponse({ description: 'Lista de jurados obtenida exitosamente.' })
  @ApiForbiddenResponse({ description: 'Forbidden. Rol no autorizado.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  findAll() {
    return this.juradoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un jurado específico por ID' })
  @ApiParam({ name: 'id', description: 'ID numérico del jurado', type: Number })
  @ApiOkResponse({ description: 'Jurado encontrado exitosamente.' })
  @ApiNotFoundResponse({ description: 'Jurado no encontrado.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ID inválido (no es un número).' })
  @ApiForbiddenResponse({ description: 'Forbidden. Rol no autorizado.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
     const jurado = await this.juradoService.findOne(id);
     if (!jurado) {
       throw new NotFoundException(`Jurado con ID "${id}" no encontrado.`);
     }
     return jurado;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un jurado por ID' })
  @ApiParam({ name: 'id', description: 'ID numérico del jurado a actualizar', type: Number })
  @ApiBody({ type: UpdateJuradoDto })
  @ApiOkResponse({ description: 'Jurado actualizado exitosamente.' })
  @ApiNotFoundResponse({ description: 'Jurado no encontrado.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos (ID o cuerpo de la solicitud).' })
  @ApiConflictResponse({ description: 'Conflicto (ej. email duplicado).' })
  @ApiForbiddenResponse({ description: 'Forbidden. Rol no autorizado.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJuradoDto: UpdateJuradoDto,
  ) {
    return this.juradoService.update(id, updateJuradoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un jurado por ID (borrado lógico)' })
  @ApiParam({ name: 'id', description: 'ID numérico del jurado a eliminar', type: Number })
  @ApiNoContentResponse({ description: 'Jurado eliminado (marcado) exitosamente.' })
  @ApiNotFoundResponse({ description: 'Jurado no encontrado.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ID inválido (no es un número).' })
  @ApiForbiddenResponse({ description: 'Forbidden. Rol no autorizado.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.juradoService.remove(id);
  }

  @Patch('confirmar-invitacion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar invitación de jurado y establecer contraseña inicial' })
  @ApiBody({ type: ConfirmarJuradoDto })
  @ApiResponse({ status: 200, description: 'Cuenta de jurado confirmada y contraseña establecida.'})
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos (ej. token o contraseña).' })
  @ApiResponse({ status: 404, description: 'Token inválido o jurado no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async confirmarYEstablecerContrasena(@Body() confirmarJuradoDto: ConfirmarJuradoDto) {
    return this.juradoService.confirmarInvitacionYEstablecerContrasena(
      confirmarJuradoDto,
    );
  }

  @Patch(':id/reenviar-invitacion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reenviar el correo de invitación a un jurado existente' })
  @ApiParam({ name: 'id', description: 'ID numérico del jurado', type: Number })
  @ApiOkResponse({ description: 'Correo de invitación reenviado exitosamente.' })
  @ApiNotFoundResponse({ description: 'Jurado no encontrado.' })
  @ApiConflictResponse({ description: 'El jurado ya ha sido confirmado.' })
  @ApiForbiddenResponse({ description: 'Forbidden. Rol no autorizado.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'ID inválido (no es un número).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error interno del servidor.' })
  async reenviarInvitacion(@Param('id', ParseIntPipe) id: number) {
    return this.juradoService.reenviarInvitacion(id);
  }

  @Get(':id/evaluaciones')
  @ApiOperation({ summary: 'Obtener evaluaciones realizadas por un jurado específico' })
  @ApiOkResponse({
    description: 'Lista de evaluaciones realizadas por el jurado.',
    type: [EvaluacionRealizadaDto],
  })
  @ApiForbiddenResponse({ description: 'Forbidden. Rol no autorizado.' })
  @ApiNotFoundResponse({ description: 'Jurado no encontrado.' })
  @ApiParam({ name: 'id', description: 'ID del Jurado', type: String })
  async findEvaluacionesRealizadas(
    @Param('id') juradoId: string,
  ): Promise<EvaluacionRealizadaDto[]> {
    return this.juradoService.findEvaluacionesRealizadas(juradoId);
  }

  @Get(':juradoId/evaluaciones/:videojuegoId')
  @ApiOperation({
    summary: 'Obtener el detalle de la calificación de un videojuego por un jurado.',
  })
  @ApiOkResponse({
    description: 'Detalle de la calificación por criterios.',
    type: [DetalleCriterioEvaluadoDto],
  })
  @ApiForbiddenResponse({ description: 'Forbidden. Rol no autorizado.' })
  @ApiNotFoundResponse({ description: 'Jurado, videojuego o evaluación no encontrados.' })
  @ApiParam({ name: 'juradoId', description: 'ID del Jurado', type: String })
  @ApiParam({ name: 'videojuegoId', description: 'ID del Videojuego', type: String })
  async findDetalleEvaluacionVideojuego(
    @Param('juradoId') juradoId: string,
    @Param('videojuegoId') videojuegoId: string,
  ): Promise<DetalleCriterioEvaluadoDto[]> {
    return this.juradoService.findDetalleEvaluacionVideojuego(Number(juradoId), Number(videojuegoId));
  }

  @Post('asignar-videojuego') 
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Asignar un videojuego a un jurado (Admin)' })
  @ApiBody({ type: AsignarVideojuegoDto })
  @ApiResponse({ status: 201, description: 'Videojuego asignado exitosamente al jurado.'})
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos (IDs faltantes o incorrectos).' })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT faltante o inválido).' })
  @ApiResponse({ status: 403, description: 'Prohibido (rol no permitido para esta acción).' })
  @ApiResponse({ status: 404, description: 'Jurado o Videojuego no encontrado o eliminado.' })
  @ApiResponse({ status: 409, description: 'Conflicto: Esta asignación ya existe.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async asignarVideojuego(@Body() asignarDto: AsignarVideojuegoDto) {
    return this.juradoService.asignarVideojuego(asignarDto);
  }

  @Delete(':juradoId/asignaciones/:videojuegoId')
@HttpCode(HttpStatus.NO_CONTENT)
@ApiOperation({ summary: 'Desasignar (eliminar asignación) un videojuego de un jurado (Admin)' })
@ApiParam({ name: 'juradoId', description: 'ID del Jurado', type: Number })         
@ApiParam({ name: 'videojuegoId', description: 'ID del Videojuego', type: Number }) 
@ApiResponse({ status: 204, description: 'Asignación eliminada (marcada como eliminada) exitosamente.'})
async desasignarVideojuego(
  @Param('juradoId', ParseIntPipe) juradoId: number,        
  @Param('videojuegoId', ParseIntPipe) videojuegoId: number, 
): Promise<void> {
  await this.juradoService.desasignarVideojuego(juradoId, videojuegoId);
}
}