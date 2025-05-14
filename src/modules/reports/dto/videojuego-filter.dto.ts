import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, IsArray } from 'class-validator';

export class VideojuegoFilter {
  @IsOptional()
  @IsArray()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform((params) => params.value.split(',').map(Number))
  @IsInt({ each: true })
  @ApiPropertyOptional({
    description: 'IDs of the videogames to fetch.',
  })
  videojuegos?: number[];
}
