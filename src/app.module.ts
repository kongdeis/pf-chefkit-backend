import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { MealkitsModule } from './mealkits/mealkits.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [MembersModule, MealkitsModule, IngredientsModule, OrdersModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
