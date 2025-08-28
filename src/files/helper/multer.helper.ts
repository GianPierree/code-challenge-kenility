import { UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { ACCEPTED_FILE_TYPES_REGEX, PRODUCTS_DIR } from '../shared/constants';

export const multerOptions: MulterOptions = {
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(ACCEPTED_FILE_TYPES_REGEX)) {
      return callback(new UnsupportedMediaTypeException('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
  storage: diskStorage({
    destination: PRODUCTS_DIR,
    filename: (req, file, callback) => {
      const fileExtension = file.mimetype.split('/')[1];
      const filename = `${uuid()}.${fileExtension}`;
      callback(null, filename);
    },
  }),
};