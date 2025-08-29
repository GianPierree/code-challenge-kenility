import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  total?: number;
}
