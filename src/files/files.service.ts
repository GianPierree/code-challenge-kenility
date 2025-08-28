import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getProductFile(filename: string): string {
    const path = join(__dirname, '../../static/products', filename);
    if (!existsSync(path)) {
      throw new BadRequestException(`Not product file found with name ${filename}`);
    }
    return path;
  }

  validateProductFile(filename: string): string {
    const path = join(__dirname, '../../static/products', filename);
    if (!existsSync(path)) {
      throw new BadRequestException(`Not product file found with name ${filename}`);
    }
    return filename;
  }
}
