import {
  Controller,
  Post,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetUser } from 'src/common/common.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto, 
    @GetUser() user: string
  ) {
    console.log('ProductsController.create');
    const result = await this.productsService.create(createProductDto, user);
    return {
      success: true,
      message: 'Product created successfully',
      product_code: result,
    };
  }

  @Get(':code')
  async findByCode(@Param('code') code: string) {
    const result = await this.productsService.findByCode(code);
    return {
      success: true,
      message: 'Product found successfully',
      product: result,
    };
  }
}