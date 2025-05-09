import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { extname } from 'path';
import * as multer from 'multer';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  
  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL') as string,
      this.configService.get('SUPABASE_KEY') as string
    );
  }

  async uploadLogo(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileExt = extname(file.originalname).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(fileExt)) {
      throw new BadRequestException('Invalid file type. Only PNG and JPEG allowed');
    }

    const fileName = `${Date.now()}${fileExt}`;
    
    const { data, error } = await this.supabase
      .storage
      .from('logos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      throw new BadRequestException('Error uploading file: ' + error.message);
    }

    const { data: urlData } = this.supabase
      .storage
      .from('logos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }
}
