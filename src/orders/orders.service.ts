import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order } from './entities/order.entity.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Injectable()
export class OrdersService {
   constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  findAll() {
    return this.ordersRepository.find();
  }

  create(createOrderDto: CreateOrderDto) {
    const order = this.ordersRepository.create({
      ...createOrderDto,
      status: 'CREATED',
    });

    return this.ordersRepository.save(order);
  }

  async findOne(id: number) {
  const order = await this.ordersRepository.findOne({
    where: { id },
  });

  if (!order) {
    throw new NotFoundException(`Order with id ${id} not found`);
  }

  return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
  const order = await this.findOne(id);

  Object.assign(order, updateOrderDto);

  return this.ordersRepository.save(order);
  }
  
  async remove(id: number){
    const order = await this.findOne(id);

    await this.ordersRepository.remove(order);

    return {
        message: `Order ${id} deleted successfully`,
    };
  }
  
}
