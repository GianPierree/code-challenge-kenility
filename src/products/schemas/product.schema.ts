import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ProductDocument = Product & Document;

@Schema({ versionKey: false })
export class Product {
  @Prop({ type: String, default: uuidv4, select: false })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: () => new Date() })
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  created_user: string;

  @Prop()
  updated_user: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);