import { AbstractDocument } from '@app/common';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class UserDocument extends AbstractDocument {
  @Prop()
  email: string;
  @Prop()
  password: string;
}

export const userSchema = SchemaFactory.createForClass(UserDocument);
