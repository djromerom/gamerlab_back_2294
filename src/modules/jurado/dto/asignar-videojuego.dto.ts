import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AsignarVideojuegoDto {
  @ApiProperty({
    description: 'ID del Videojuego a asignar',
    example: 1, // Ejemplo de ID numérico
  })
  @IsInt({ message: 'El ID del videojuego debe ser un número entero' })
  @Min(1, { message: 'El ID del videojuego debe ser un entero positivo' }) // > 0
  @IsNotEmpty({ message: 'El ID del videojuego no puede estar vacío' })
  videojuegoId: number; // Corresponde a id_videojuego en la tabla

  @ApiProperty({
    description: 'ID del Jurado al que se asigna el videojuego',
    example: 1, // Ejemplo de ID numérico
  })
  @IsInt({ message: 'El ID del jurado debe ser un número entero' })
  @Min(1, { message: 'El ID del jurado debe ser un entero positivo' }) // > 0
  @IsNotEmpty({ message: 'El ID del jurado no puede estar vacío' })
  juradoId: number; // id_jurado en la tabla
}