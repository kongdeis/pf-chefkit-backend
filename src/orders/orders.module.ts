import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MealkitsModule } from '../mealkits/mealkits.module';

@Module({
  imports: [MealkitsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
