import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Put(':id')
  update(
  @Param('id') id: string,
  @Body() updateOrderDto: UpdateOrderDto,
  ) {
  return this.ordersService.update(
    Number(id),
    updateOrderDto,
  );
  }

  @Delete(':id')
  remove(@Param('id') id: string)  {
    return this.ordersService.remove(Number(id));
  }

}
