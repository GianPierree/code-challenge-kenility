import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/common/common.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_REPORT_CODE } from './shared/constants';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: string,
  ) {
    const result = await this.ordersService.create(createOrderDto, user);
    return {
      success: true,
      message: 'Order created successfully',
      order_code: result,
    };
  }

  @Get(':code')
  async findByCode(@Param('code') code: string) {
    const result = await this.ordersService.findByCode(code);
    return {
      success: true,
      message: 'Order found successfully',
      order: result,
    };
  }

  @Patch(':code')
  async updateByCode(
    @Param('code') code: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: string,
  ) {
    const result = await this.ordersService.updateByCode(code, updateOrderDto, user);
    return {
      success: result,
      message: `Order ${code} updated ${result ? 'successfully' : 'unsuccessfully'}`,
    };
  }

  @Get('report/:code')
  async report(@Param('code') code: string) {
    const result = await this.ordersService.report(code);
    return {
      success: true,
      message: `Order report ${code === ORDER_REPORT_CODE.TOTAL_LAST_MONTH ? 'total last month' : 'higher amount'} successfully`,
      report: result,
    };
  }
}
