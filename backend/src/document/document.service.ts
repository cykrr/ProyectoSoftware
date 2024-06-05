import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Doc } from 'src/schemas/document.schema';
import { Model } from 'mongoose';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,

    @InjectModel(Document.name)
    private docModel: Model<Doc>,
  ) {}
  async create(file: Buffer): Promise<Doc> {
    const createDocumentDto = {
      name: 'test',
      data: file,
    };
    const createdDocument = new this.docModel(createDocumentDto);
    return createdDocument.save();
  }
}
