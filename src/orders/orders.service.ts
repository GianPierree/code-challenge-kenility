import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CommonService } from 'src/common/common.service';
import { PREFIX } from 'src/common/common.constants';
import { BadRequestException } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_REPORT_CODE } from './shared/constants';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly commonService: CommonService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, email: string): Promise<string> {
    try {
      const { products, total } = await this.validateOrderProducts(createOrderDto.products);
      const createdOrder = new this.orderModel({
        ...createOrderDto,
        products,
        code: this.commonService.generateCode(PREFIX.ORDER),
        created_user: email,
        total,
      });
      const result = await createdOrder.save();
      
      return result.code;
    } catch (error) {
      console.log('error');
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async findByCode(code: string): Promise<Order | null> {
    try {
      return await this.orderModel.findOne({ code }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async updateByCode(code: string, updateOrderDto: UpdateOrderDto, email: string): Promise<boolean> {
    try {
      const order = await this.findByCode(code);
      
      if (!order) {
        throw new BadRequestException(`Order ${code} not found`);
      }

      if (updateOrderDto.products) {
        const { products, total } = await this.validateOrderProducts(updateOrderDto.products);
        updateOrderDto.products = products;
        updateOrderDto.total = total;
      }

      const result = await this.orderModel.findOneAndUpdate(
        { code },
        { ...updateOrderDto, updated_user: email, updated_at: new Date() },
      ).exec();

      return Boolean(result);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async report(code: string): Promise<Order | number | null> {
    if (!Object.values(ORDER_REPORT_CODE).includes(code)) {
      throw new BadRequestException('Code not valid');
    }
    const result = code === ORDER_REPORT_CODE.TOTAL_LAST_MONTH ? await this.findTotalLastMonth() : await this.findHigherAmount();
    return result;
  }

  private async validateOrderProducts(products: CreateOrderProductDto[]): Promise<{ products: CreateOrderProductDto[], total: number }> {
    try {
      const subTotalProducts = await this.productsService.calculateSubTotalByProductCode(products);
      const total = subTotalProducts.reduce((acc, product) => acc + product.subTotal, 0);
      return { 
        products: subTotalProducts.map(({ code, quantity }) => ({ product_code: code, quantity })),
        total,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  private async findTotalLastMonth(): Promise<number> {
    try {
      const result = await this.orderModel.aggregate([
        {
          $match: {
            created_at: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
          },
        },
      ]).exec();

      return result[0]?.total || 0;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  private async findHigherAmount(): Promise<Order | null> {
    try {
      return await this.orderModel.findOne({
        total: { $gte: 0 },
      }).sort({ total: -1 }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
