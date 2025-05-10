import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RubricaEntity } from './rubrica.entity';

export class EvaluacionEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  jurado_id: number;

  @ApiProperty()
  @Expose()
  videojuego_id: number;

  @ApiProperty()
  @Expose()
  comentarios?: string;

  @ApiProperty()
  @Expose()
  create_at: Date;

  @ApiProperty({ type: [RubricaEntity] })
  @Expose()
  @Type(() => RubricaEntity)
  rubricas: RubricaEntity[];

  constructor(partial: Partial<EvaluacionEntity>) {
    Object.assign(this, partial);
  }
}
