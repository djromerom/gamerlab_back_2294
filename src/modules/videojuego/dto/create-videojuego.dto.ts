import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNotEmpty, IsNumber } from "class-validator";

export class CreateVideojuegoDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: true})
    nombre_videojuego: string;
  
    @IsString()
    @IsOptional()
    @ApiProperty({required: true})
    descripcion: string;
  
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({required: true})
    equipo_id: number;
}