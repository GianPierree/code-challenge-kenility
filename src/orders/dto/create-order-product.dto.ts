import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderProductDto {
  @IsNotEmpty()
  @IsString()
  product_code: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}