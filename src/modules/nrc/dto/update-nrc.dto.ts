import { PartialType } from '@nestjs/swagger';
import { CreateNrcDto } from './create-nrc.dto';

export class UpdateNrcDto extends PartialType(CreateNrcDto) {}
