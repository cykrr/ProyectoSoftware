import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { MDocument } from './mdocument.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from 'src/schemas/document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([MDocument]),
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]),
  ],
  controllers: [DocumentController],
  exports: [TypeOrmModule.forFeature([MDocument])],
})
export class DocumentModule {}
