import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ValidationExitsService {
  validateExists(table: string, value: any) {
    if (!value) {
      throw new HttpException(
        `El ${table} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}