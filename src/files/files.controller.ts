import { 
  Controller, 
  ParseFilePipeBuilder, 
  Post, 
  UseInterceptors,
  HttpStatus,
  Get,
  Param,
  Res, 
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE } from './shared/constants';
import { multerOptions } from './helper/multer.helper';
import express from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {} 

  @Get('product/:filename')
  getProductFile(
    @Res() res: express.Response,
    @Param('filename') filename: string
  ) {
    res.sendFile(this.filesService.getProductFile(filename));
  }
  
  @Post('product')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addMaxSizeValidator({ maxSize: MAX_FILE_SIZE })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
  ) file: Express.Multer.File) {
    
    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        name: file.filename,
      },
    };
  }
}
