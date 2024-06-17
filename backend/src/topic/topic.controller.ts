import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { Topic, Unidad } from './topic.entity';
import { BResponse } from '../common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('topics')
export class TopicController {
  constructor(private topicService: TopicService) {}
  // @Post(':id/createUnidad')
  // async createUnidad(@Param('id') id: number, @Body() body) {
  //   return await this.topicService.createUnidad(id, body);
  // }

  @Get(':id:/unidades/:unidadId')
  async getUnidad(
    @Param('id') id: number,
    @Param('unidadId') unidadId: number,
  ): Promise<BResponse<Unidad>> {
    const data = await this.topicService.obtenerUnidad(id, unidadId);
    return { success: true, data };
  }

  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 * 100 } }),
  )
  @Post(':id/unidades/:unidadId/cargar')
  async cargarDocumento(
    @Param('id') topicId: number,
    @Param('unidadId') unidadId: number,
    @Body() body: { name: string; nombreUnidad: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 100 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      return await this.topicService.cargarDocumento(
        +topicId,
        +unidadId,
        file,
        body.name,
        body.nombreUnidad!,
      );
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<BResponse<Topic>> {
    const data = await this.topicService.find(id);
    return { success: true, data };
  }
}
