import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateTokenService {
  generateToken(): string {
    return randomBytes(32).toString('hex');
  }
}