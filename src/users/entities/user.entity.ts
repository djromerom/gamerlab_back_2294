import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class UsuarioEntity {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  nombre_completo: string;

  @ApiProperty()
  email: string;

  @Exclude()
  hash_contrasena: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @Exclude()
  deleted: boolean;

  @ApiProperty( { isArray: true })
  @ValidateNested({ each: true })
  @Exclude()
  Roles?: any[];

  @ApiProperty( { isArray: true })
  @ValidateNested({ each: true })
  @Expose()
  NRCs?: any[];

  constructor(partial: Partial<UsuarioEntity>) {
    Object.assign(this, partial);
  }
}