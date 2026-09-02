import { IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  total: number;
}