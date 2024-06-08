import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MDocument } from './mdocument.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Unidad } from 'src/topic/topic.entity';

export class CreateDocumentDto {
  name: string | undefined;
  filename: string | undefined;
  mimetype: string | undefined;
  fileid: string | undefined;
  unidad?: Unidad | undefined;
}

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(MDocument) private repo: Repository<MDocument>,
  ) {}
  async create(file: DeepPartial<MDocument>): Promise<MDocument> {
    return await this.repo.create(file);
  }

  async save(file: MDocument): Promise<MDocument> {
    return await this.repo.save(file);
  }

  async find(fileid: string): Promise<MDocument> {
    return await this.repo.findOneBy({ fileid });
  }
}
