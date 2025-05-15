import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, IsArray, IsEnum } from 'class-validator';

export enum WorksheetViewType {
    ByName = "byName",
    ByJurado = "byJurado"
}

export class WorksheetFilter {
  @IsOptional()
  @IsArray()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform((params) => params.value.split(',').map(Number))
  @IsInt({ each: true })
  @ApiPropertyOptional({
    description: 'IDs of the videogames to fetch.',
  })
  videojuegos?: number[];

  @IsEnum(WorksheetViewType)
  @ApiProperty({
    description: 'The view type - if set to `byJurado`, each row will have jurado ratings for the first `videojuegos` element. Otherwise, each row will be the respective videojuego\'s average ratings.',
  })
  view: WorksheetViewType;
}
