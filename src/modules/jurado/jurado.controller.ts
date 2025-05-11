import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpStatus,
    UseInterceptors,
    ClassSerializerInterceptor,
    SerializeOptions,
    ParseIntPipe
} from '@nestjs/common';
import { JuradoService } from './jurado.service';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiResponse
} from '@nestjs/swagger';
import { JuradoEntity } from './entities/jurado.entity';

@ApiTags('jurado')
@Controller('jurado')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: JuradoEntity })
export class JuradoController {
    constructor(private readonly juradoService: JuradoService) { }

    @Post()
    @ApiCreatedResponse({
        type: JuradoEntity,
        description: 'Jurado creado exitosamente.'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Acción no autorizada.'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos proporcionados.'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'El usuario ya está registrado como jurado.'
    })
    create(@Body() createJuradoDto: CreateJuradoDto) {
        return this.juradoService.create(createJuradoDto);
    }

    @Get()
    @ApiOkResponse({
        type: JuradoEntity,
        isArray: true,
        description: 'Lista de jurados obtenida exitosamente.'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Acción no autorizada.'
    })
    findAll() {
        return this.juradoService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({
        type: JuradoEntity,
        description: 'Jurado encontrado.'
    })
    @ApiNotFoundResponse({
        description: 'Jurado no encontrado.'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Acción no autorizada.'
    })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.juradoService.findOne(id);
    }

    @Get('confirmar/:token')
    @ApiOkResponse({
        type: JuradoEntity,
        description: 'Jurado confirmado exitosamente.'
    })
    @ApiNotFoundResponse({
        description: 'Token de confirmación inválido.'
    })
    confirmarJurado(@Param('token') token: string) {
        return this.juradoService.confirmarJurado(token);
    }

    @Patch(':id/reenviar-invitacion')
    @ApiOkResponse({
        type: JuradoEntity,
        description: 'Invitación reenviada exitosamente.'
    })
    @ApiNotFoundResponse({
        description: 'Jurado no encontrado.'
    })
    reenviarInvitacion(@Param('id', ParseIntPipe) id: number) {
        return this.juradoService.reenviarInvitacion(id);
    }

    @Post(':id/asignar-videojuego/:videojuegoId')
    @ApiOkResponse({
        type: JuradoEntity,
        description: 'Videojuego asignado exitosamente.'
    })
    @ApiNotFoundResponse({
        description: 'Jurado o videojuego no encontrado.'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'El videojuego ya está asignado a este jurado.'
    })
    asignarVideojuego(
        @Param('id', ParseIntPipe) id: number,
        @Param('videojuegoId', ParseIntPipe) videojuegoId: number
    ) {
        return this.juradoService.asignarVideojuego(id, videojuegoId);
    }

    @Delete(':id/eliminar-asignacion/:videojuegoId')
    @ApiOkResponse({
        type: JuradoEntity,
        description: 'Asignación eliminada exitosamente.'
    })
    @ApiNotFoundResponse({
        description: 'Jurado, videojuego o asignación no encontrada.'
    })
    eliminarAsignacion(
        @Param('id', ParseIntPipe) id: number,
        @Param('videojuegoId', ParseIntPipe) videojuegoId: number
    ) {
        return this.juradoService.eliminarAsignacion(id, videojuegoId);
    }

    @Patch(':id')
    @ApiOkResponse({
        type: JuradoEntity,
        description: 'Jurado actualizado exitosamente.'
    })
    @ApiNotFoundResponse({
        description: 'Jurado no encontrado.'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Acción no autorizada.'
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateJuradoDto: UpdateJuradoDto
    ) {
        return this.juradoService.update(id, updateJuradoDto);
    }

    @Delete(':id')
    @ApiOkResponse({
        type: JuradoEntity,
        description: 'Jurado eliminado exitosamente.'
    })
    @ApiNotFoundResponse({
        description: 'Jurado no encontrado.'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Acción no autorizada.'
    })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.juradoService.remove(id);
    }

    @Get(':id/videojuegos-asignados')
    @ApiOkResponse({
        type: JuradoEntity,
        description: 'Lista de videojuegos asignados obtenida exitosamente.'
    })
    @ApiNotFoundResponse({
        description: 'Jurado no encontrado.'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Acción no autorizada.'
    })
    getVideojuegosAsignados(@Param('id', ParseIntPipe) id: number) {
        return this.juradoService.getVideojuegosAsignados(id);
    }
}