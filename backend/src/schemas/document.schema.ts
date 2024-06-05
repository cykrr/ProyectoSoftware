import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Document = HydratedDocument<Doc>;
@Schema()
export class Doc {
  @Prop()
  name: string;
  @Prop()
  data: Buffer;
}

export const DocumentSchema = SchemaFactory.createForClass(Doc);
