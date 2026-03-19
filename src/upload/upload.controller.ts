import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/utils/multer-config.util';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file để upload');
    }

    return {
      message: 'Upload thành công',
      filePath: `/uploads/${file.filename}`,
      fileName: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
