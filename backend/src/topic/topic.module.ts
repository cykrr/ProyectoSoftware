import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic, Unidad } from './topic.entity';
import { DocumentService } from 'src/document/document.service';
import { DocumentModule } from 'src/document/document.module';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unidad, Topic]),
    DocumentModule,
    FilesModule,
  ],
  controllers: [TopicController],
  providers: [TopicService, DocumentService, FilesService],
  exports: [TypeOrmModule.forFeature([Unidad, Topic]), DocumentModule],
})
export class TopicModule {}
