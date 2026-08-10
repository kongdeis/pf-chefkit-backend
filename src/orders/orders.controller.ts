import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type AuthMember, CurrentMember } from '../common/current-member.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';


@ApiTags('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '밀키트 주문'})
  create(@Body() createOrderDto: CreateOrderDto, @CurrentMember() member: AuthMember) {
    return this.ordersService.create(createOrderDto, member);
  }

  @Get('my') 
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '로그인한 회원의 주문 내역'})
  findMyOrders(@CurrentMember() member: AuthMember, @Query() query: SearchOrderDto){
    return this.ordersService.findMyOrders(member, query);
  }

  @Get('chef') 
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '쉐프가 만든 밀키트 주문 조회'})
  findChefOrders(@CurrentMember() member: AuthMember, @Query() query: SearchOrderDto){
    return this.ordersService.findChefOrders(member, query);
  }


  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '관리자용 주문 조회'})
  findAll(@CurrentMember() member: AuthMember, @Query() query: SearchOrderDto) {
    return this.ordersService.findAll(member, query);
  }

  @Get('all/:id')
  @ApiOperation({summary: '주문 상세 정보'})
  findOneDetail(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOneDetail(+id);
  }

  @Patch('all/:id/status')
  @ApiOperation({summary: '특정 주문 수정(주문 상태 변경만 가능)'})
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto, @CurrentMember() member: AuthMember) {
    return this.ordersService.updateStatus(+id, dto, member);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
