import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MFile, MFileDocument } from './mfile.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class FilesService {
  constructor(@InjectModel(MFile.name) private mfileModel: Model<MFile>) {}

  async find(fileid: Types.ObjectId): Promise<MFileDocument> {
    return this.mfileModel.findById(fileid).exec();
  }

  async create(
    filename: string,
    contentType: string,
    buffer: Buffer,
  ): Promise<MFileDocument> {
    const createdMFile = new this.mfileModel({ filename, contentType, buffer });
    return createdMFile.save();
  }
  async findAll(): Promise<MFileDocument[]> {
    return this.mfileModel.find().exec();
  }
}
