import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthMember } from '../common/current-member.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { MealkitsService } from '../mealkits/mealkits.service';
import { SearchOrderDto } from './dto/search-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mealkitService: MealkitsService
  ){}

  async create(createOrderDto: CreateOrderDto, member: AuthMember) {
    // 밀키트 확인
    const {orderItems} = createOrderDto;
    const mealkitIds = await orderItems.map((item) => item.mealkitId);
    const uniqueIds = [...new Set(mealkitIds)];
    const mealkits = await this.prisma.mealkit.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
      },
    });

    if (uniqueIds.length !== mealkits.length) {
      throw new BadRequestException(
        '존재하지 않는 밀키트가 포함되어 있습니다.',
      );
    }
    const mealkitPriceMap = new Map(mealkits.map(i => [i.id, i.price]));

     // transaction을 감싸서 작업할 준비
    return this.prisma.$transaction(async (tx) => {
      let totalOrderPrice = 0;  // 전체 주문 가격

      // 가격 계산
      const orderItemsTemp = orderItems.map((item) => {
        const unitPrice = mealkitPriceMap.get(item.mealkitId) ?? 0;
        const price = unitPrice * item.quantity;
        totalOrderPrice += price;

        return {
          mealkitId: item.mealkitId,
          quantity: item.quantity,
          unitPrice
        }
      })

      // order 생성
      const order = await tx.order.create({
        data: {
          memberId: member.id,
          totalPrice: totalOrderPrice,
        }
      })


      // orderItem 데이터
      const orderItemData = orderItemsTemp.map((item) => ({
        ...item,
        orderId: order.id
      }));

      await tx.orderItem.createMany({
        data: orderItemData
      })

      // mealkit테이블에서 주문수 증가
      await Promise.allSettled(
        orderItems.map(item => 
          tx.mealkit.update({
            where: {id: item.mealkitId},
            data: {
              orderCount: {
                increment: item.quantity
              }
            }
          })
        )
      )

      return await tx.order.findUnique({
        where: {id: order.id},
        include: {
          orderItems: {
            include: {
              mealkit: true
            }
          }
        }
      })
    });
  }

  async findAll(
    member: AuthMember,
    query: SearchOrderDto,
) {
    // 관리자 권한 확인
    const {role} = await member;
    if(role != 'ADMIN') throw new ForbiddenException(`주문 조회 권한이 없습니다.`);

    const where: any = {};

    if(query.status){
      where.status = query.status;
    }

    if(query.memberId){
      where.memberId = query.memberId;
    }

    return this.prisma.order.findMany({
      where,
      orderBy: {
        orderedAt: query.orderByDate ?? 'desc',
      },
      include: {
        orderItems: {
          include: {
            mealkit: true,
          },
        },
        member: true,
      },
    });
  }

  async findMyOrders(
    member: AuthMember,
    query: SearchOrderDto,
  ) {

    return this.prisma.order.findMany({
      where: {
        memberId: member.id,
        ...(query.status && {
          status: query.status,
        }),
      },
      include: {
        orderItems: {
          include: {
            mealkit: true,
          },
        },
      },
    });
  }

  async findChefOrders(
    member: AuthMember,
    query: SearchOrderDto,
  ) {

    if(!['CHEF','ADMIN'].includes(member.role)){
      throw new ForbiddenException('주문 조회 권한이 없습니다');
    }

    return this.prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            mealkit: {
              chefId: member.id,
            },
          },
        },
      },
      include: {
        member: true,
        orderItems: {
          include: {
            mealkit: true,
          },
        },
      },
    });
  }



  findOne(id: number) {
    const order = this.prisma.order.findUnique({where: {id}});
    if(!order) throw new NotFoundException(`주문번호 ${id} 찾을 수 없습니다`)
    return order;
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }


  // 주문 상세 정보
  async findOneDetail(id:number){
    const order = await this.prisma.order.findUnique({
      where: {id},
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            phone: true,
            role: true
          }
        },
        orderItems: {
          include: {
            mealkit: true
          }
        }
      }
    });
    if(!order) throw new NotFoundException(`주문번호 ${id}를 찾을 수 없습니다`)
    return order;
  }



  // 주문 상태 수정
  async updateStatus(id: number, dto: UpdateOrderDto, member: AuthMember){
    // 관리자 권한 확인
    const {role} = await member;
    if(role != 'ADMIN') throw new ForbiddenException(`주문 수정 권한이 없습니다.`);
    
    const order = await this.findOne(id);
    
    console.log('---cancel order---', order)

    return this.prisma.order.update({
      where: {id},
      data: {
        status: dto.status
      }
    })
  }

}
