import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { CriterioEntity } from './criterio.entity';

export class RubricaEntity {
  @ApiProperty()
  @Expose()
  id_criterio: number;

  @ApiProperty()
  @Expose()
  valoracion: number;

  @ApiProperty({
    type: () => CriterioEntity,
    description: 'Datos del criterio asociado',
  })
  @Expose()
  @Type(() => CriterioEntity)
  criterio: CriterioEntity;

  @Exclude()
  id_evaluacion: number;

  @Exclude()
  create_at: Date;

  @Exclude()
  deleted: boolean;

  constructor(partial: Partial<RubricaEntity>) {
    Object.assign(this, partial);
  }
}


