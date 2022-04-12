import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type AuthorDocument = Author & Document;

@Schema({ timestamps: true })
export class Author {
  @Prop({ unique: true })
  authorId: string;

  @Prop({ required: true })
  twitterCreatedAt: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ unique: true })
  address: string; // User wallet address

  @Prop({ required: true })
  valid: boolean;
}

const AuthorSchema = SchemaFactory.createForClass(Author);

AuthorSchema.plugin(paginate);

export { AuthorSchema };
