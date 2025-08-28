import { 
  Controller, 
  FileTypeValidator, 
  MaxFileSizeValidator, 
  ParseFilePipe, 
  Post, 
  UseInterceptors 
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  MAX_FILE_SIZE, 
  ACCEPTED_FILE_TYPES, 
  PRODUCTS_DIR 
} from './shared/constants';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {} 
  
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: PRODUCTS_DIR,
      filename: (req, file, callback) => {
        const fileExtension = file.mimetype.split('/')[1];
        const filename = `${uuid()}.${fileExtension}`;
        callback(null, filename);
      },
    }),
  }))
  uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
        new FileTypeValidator({ fileType: ACCEPTED_FILE_TYPES }),
      ]
    })
  ) file: Express.Multer.File) {
    console.log(file);
    return {
      name: file.originalname,
      size: file.size,
      encoding: file.encoding,
      mimetype: file.mimetype,
    };
  }
}
