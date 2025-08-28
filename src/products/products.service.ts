import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { PREFIX } from 'src/common/common.constants';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly commonService: CommonService,
  ) {}

  async create(createProductDto: CreateProductDto, email: string): Promise<string> {
    try {
      const createdProduct = new this.productModel({
        ...createProductDto,
        code: this.commonService.generateCode(PREFIX.PRODUCT),
        created_user: email,
      });
      const result = await createdProduct.save();
      return result.code;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
