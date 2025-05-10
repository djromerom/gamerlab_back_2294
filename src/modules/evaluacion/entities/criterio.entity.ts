import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CriterioEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  nombre: string;

  @ApiProperty()
  @Expose()
  descripcion: string;

  constructor(partial: Partial<CriterioEntity>) {
    Object.assign(this, partial);
  }
}
