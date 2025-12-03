import { Controller, Post, Body } from '@nestjs/common';

import { OrderService } from './order.service';
import { CreateOrderDTO, OrderDTO } from './dto/order.dto';
import { ItemsListResponse } from 'src/films/types';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDTO): Promise<ItemsListResponse<OrderDTO>> {
    return this.orderService.create(createOrderDto);
  }
}
