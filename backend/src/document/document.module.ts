import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { MDocument } from './mdocument.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from 'src/schemas/document.schema';
import { DocumentService } from './document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MDocument]),
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [
    TypeOrmModule.forFeature([MDocument]),
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]),
  ],
})
export class DocumentModule {}
