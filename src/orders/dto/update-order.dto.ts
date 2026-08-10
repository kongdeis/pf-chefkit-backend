import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

  @ApiProperty({enum: ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED']})
  @IsEnum(OrderStatus)
  status: OrderStatus;

}
