import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { Readable } from 'typeorm/platform/PlatformTools';
import { Types } from 'mongoose';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}
  @Get(':id')
  async getFile(@Param('id') fileid: string, @Res() res: Response) {
    const file = await this.filesService.find(new Types.ObjectId(fileid));
    const readable = new Readable();
    readable._read = () => {};
    readable.push(file.buffer);
    readable.push(null);
    readable.pipe(res);
  }
  @Get()
  getFiles(): object {
    return this.filesService.findAll().then((files) => {
      return files.map((file) => {
        return {
          fileid: file._id,
          filename: file.filename,
          mimetype: file.contentType,
        };
      });
    });
  }
}
