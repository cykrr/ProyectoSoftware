import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MFile, MFileSchema } from './mfile.schema';
import { FilesController } from './files.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MFile.name, schema: MFileSchema }]),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
