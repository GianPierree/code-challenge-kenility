import { Document } from 'mongoose';
import { Prop, PropOptions, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

const productPropOptions: PropOptions = { 
  required: true, 
  type: [
    { 
      product_code: { type: String, ref: 'Product', required: true }, 
      quantity: Number 
    } 
  ] 
}

interface Products {
  product_code: string;
  quantity: number;
}

export type OrderDocument = Order & Document;
  
@Schema({ versionKey: false })
export class Order {

  @Prop({ type: String, default: uuidv4, select: false })
  _id: string;

  @Prop({ required: true })
  client: string;

  @Prop(productPropOptions)
  products: Products[];

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: () => new Date() })
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  created_user: string;

  @Prop()
  updated_user: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);