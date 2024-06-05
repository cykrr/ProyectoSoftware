import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MFileDocument = HydratedDocument<MFile>;

@Schema()
export class MFile {
  @Prop()
  filename: string;

  @Prop()
  name: string;

  @Prop()
  contentType: string;

  @Prop()
  buffer: Buffer;
}

export const MFileSchema = SchemaFactory.createForClass(MFile);
