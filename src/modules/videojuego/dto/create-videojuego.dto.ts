import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNotEmpty, IsNumber, MaxLength, MinLength } from "class-validator";

export class CreateVideojuegoDto {
    
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({required: true})
    nombre_videojuego: string;
  
    @IsString()
    @IsOptional()
    @MaxLength(300)
    @MinLength(10)
    @ApiProperty({required: true})
    descripcion: string;
  
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({required: true})
    equipo_id: number;
}