import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { PREFIX } from 'src/common/common.constants';
import { FilesService } from 'src/files/files.service';
import { CreateOrderProductDto } from 'src/orders/dto/create-order-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly commonService: CommonService,
    private readonly filesService: FilesService,
  ) {}

  async create(createProductDto: CreateProductDto, email: string): Promise<string> {
    try {
      const createdProduct = new this.productModel({
        ...createProductDto,
        image: this.filesService.validateProductFile(createProductDto.image),
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

  async findByCode(code: string): Promise<Product | null> {
    try {
      return await this.productModel.findOne({ code }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async calculateSubTotalByProductCode(products: CreateOrderProductDto[]): Promise<{ code: string, quantity: number, subTotal: number }[]> {
    try {
      const subTotalProducts = await Promise.all(products.map(async (product) => {
        const result = await this.findByCode(product.product_code);

        if (!result) {
          throw new BadRequestException(`Product ${product.product_code} not found`);
        }

        return {
          code: String(result.code),
          quantity: Number(product.quantity),
          subTotal: Number(result.price) * Number(product.quantity),
        };
      }));

      return subTotalProducts;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

}
