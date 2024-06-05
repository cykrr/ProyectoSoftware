import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}
  @Get()
  getFiles(): object {
    return this.filesService.findAll().then((files) => {
      return files.map((file) => {
        return {
          id: file._id,
          filename: file.filename,
          mimetype: file.contentType,
        };
      });
    });
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<object> {
    console.log(body);
    return this.filesService
      .create(file.originalname, file.mimetype, file.buffer)
      .then((mfile) => {
        return {
          success: true,
          document: {
            id: mfile._id,
            filename: mfile.filename,
            mimetype: mfile.contentType,
            name: body.name,
          },
        };
      });
  }
}
