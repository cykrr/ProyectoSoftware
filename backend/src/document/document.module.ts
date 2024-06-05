import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from './document.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from 'src/schemas/document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
