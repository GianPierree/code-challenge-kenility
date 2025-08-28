import {
  Controller,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto, 
    @Req() req
  ) {
    const result = await this.productsService.create(createProductDto, req.user);
    return {
      success: true,
      message: 'Product created successfully',
      product_code: result,
    };
  }
}
