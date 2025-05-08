import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class RubricaEntity {
  @ApiProperty()
  id_criterio: number;

  @ApiProperty()
  valoracion: number;

  @ApiProperty({
    type: () => CriterioEntity,
    description: 'Datos del criterio asociado',
  })
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

class CriterioEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  descripcion: string;

  constructor(partial: Partial<CriterioEntity>) {
    Object.assign(this, partial);
  }
}
