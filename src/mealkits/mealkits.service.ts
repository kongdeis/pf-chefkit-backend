import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMealkitDto } from './dto/create-mealkit.dto';
import { UpdateMealkitDto } from './dto/update-mealkit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthMember } from '../common/current-member.decorator';
import { emit } from 'process';
import { SearchMealkitDto } from './dto/search-mealkit.dto';
import { contains } from 'class-validator';

@Injectable()
export class MealkitsService {
  constructor(private readonly prisma: PrismaService){}


  async create(createMealkitDto: CreateMealkitDto, member: AuthMember) {
    // 관리자 권한 확인
    const {role} = await member;
    const allowedRoles = ['ADMIN', 'CHEF'];
    if(!allowedRoles.includes(role)) throw new ForbiddenException(`밀키트 등록 권한이 없습니다.`)
    const chefId = member.id;
      
    // 재료 확인
    const { mealkitIngredients } = createMealkitDto;      
    const ingredientIds = await mealkitIngredients.map(item => item.ingredientId);
    const ingredients = await this.prisma.ingredient.findMany({
      where: {id: {in: ingredientIds}}
    })
    if(ingredientIds.length !== ingredients.length){
      throw new BadRequestException(`존재하지 않는 재료가 포함되어 있습니다`)
    }
    const ingredientsPrice = new Map(ingredients.map(i => [i.id, i.unitPrice]));
    
    // transaction을 감싸서 작업할 준비
    return this.prisma.$transaction(async (tx) => {
      let totalMealkitPrice = 0;  // 전체 밀키트 가격

      // 가격 계산
      const ingredientItemsTemp = mealkitIngredients.map((item) => {
        const unitPrice = ingredientsPrice.get(item.ingredientId) ?? 0;
        const price = unitPrice * item.quantity;

        totalMealkitPrice += price;

        return {
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          price,
        };
      });

      // mealkit 생성
      const mealkit = await tx.mealkit.create({
        data: {
          chefId: chefId,
          name: createMealkitDto.name,
          recipe: createMealkitDto.recipe,
          description: createMealkitDto.description,
          price: totalMealkitPrice,
        }
      })

      // 재료 아이템 mealkitId 붙이기
      const ingredientItems = ingredientItemsTemp.map((item) => ({
        ...item,
        mealkitId: mealkit.id,
      }));

      await tx.mealkitIngredient.createMany({
        data: ingredientItems,
      });

      return await tx.mealkit.findUnique({
        where: {id: mealkit.id},
        include: {
          mealkitIngredients: {
            include: {
              ingredient: true
            }
          }
        }
      })
    });
  }

  async findAll(query: SearchMealkitDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;


    const where: any = {};

    let orderBy: any = { updatedAt: 'desc' };

    switch (query.sort) {
      case 'oldest':
        orderBy = { updatedAt: 'asc' };
        break;

      case 'priceHigh':
        orderBy = { price: 'desc' };
        break;

      case 'priceLow':
        orderBy = { price: 'asc' };
        break;

      case 'popular':
        orderBy = { orderCount: 'desc' };
        break;

      default:
        orderBy = { updatedAt: 'desc' };
    }


    if(query.search){
      where.OR = [
        {name: {contains: query.search, mode: 'insensitive'}},
        {recipe: {contains: query.search, mode: 'insensitive'}},
        {description: {contains: query.search, mode: 'insensitive'}},
      ]
    }

    const [items, total] = await Promise.all([
      this.prisma.mealkit.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.mealkit.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 쉐프id로 찾기
  async findChef(query: SearchMealkitDto, member: AuthMember){
    const chefId = await member.id;

    const where: any = {
      chefId: chefId
    };

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    let orderBy: any = { updatedAt: 'desc' };

    switch (query.sort) {
      case 'oldest':
        orderBy = { updatedAt: 'asc' };
        break;

      case 'priceHigh':
        orderBy = { price: 'desc' };
        break;

      case 'priceLow':
        orderBy = { price: 'asc' };
        break;

      case 'popular':
        orderBy = { orderCount: 'desc' };
        break;

      default:
        orderBy = { updatedAt: 'desc' };
    }

    if(query.name){
      where.name = {contains: query.name, mode: 'insensitive'}
    }

    if(query.search){
      where.OR = [
        {name: {contains: query.search, mode: 'insensitive'}},
        {recipe: {contains: query.search, mode: 'insensitive'}},
        {description: {contains: query.search, mode: 'insensitive'}},
      ]
    }

    const [items, total] = await Promise.all([
      this.prisma.mealkit.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.mealkit.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const mealkit = await this.prisma.mealkit.findUnique({where: {id}});
    if(!mealkit) throw new NotFoundException(`밀키트 ${id} 찾을 수 없습니다`)
    return mealkit;
  }

  async update(id: number, updateMealkitDto: UpdateMealkitDto, member: AuthMember) {
    // 권한 확인
    const {role} = await member;
    const allowedRoles = ['ADMIN', 'CHEF'];
    if(!allowedRoles.includes(role)) throw new ForbiddenException(`밀키트 수정 권한이 없습니다.`)
    console.log('---update---', updateMealkitDto);

    // 밀키트 확인
    const mealkit = await this.findOne(id);
    
    // 쉐프 권한일 경우 밀키트를 등록한 쉐프가 맞는지 확인
    if(member.role === 'CHEF' && mealkit.chefId !== member.id) throw new ForbiddenException(`밀키트 수정 권한이 없습니다.`);

    return this.prisma.$transaction(async (tx) => {
      // 밀키트재료 수정이 없는 경우
      if(!updateMealkitDto.mealkitIngredients){
        return tx.mealkit.update({
          where: {id},
          data: {
            name: updateMealkitDto.name,
            recipe: updateMealkitDto.recipe,
            description: updateMealkitDto.description
          }
        })
      }
      // 밀키트 재료 수정이 있는 경우
      const ingredientIds = updateMealkitDto.mealkitIngredients.map((item) => item.ingredientId);
      const ingredients = await tx.ingredient.findMany({
        where: {
          id: {
            in: ingredientIds
          }
        }
      });
      if(ingredientIds.length !== ingredients.length){
        throw new BadRequestException(`존재하지 않는 재료가 포함되어 있습니다`)
      }
      const ingredientsPrice = new Map(ingredients.map(i => [i.id, i.unitPrice]));
      let totalPrice = 0;
      const ingredientItems = updateMealkitDto.mealkitIngredients.map((item) => {
        const unitPrice = ingredientsPrice.get(item.ingredientId) ?? 0;
        const price = unitPrice * item.quantity;
        totalPrice += price;
        return {
          mealkitId: id,
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          price
        }
      });
      // 기존 밀키트 재료 삭제
      await tx.mealkitIngredient.deleteMany({
        where: {
          mealkitId: id
        }
      });

      await tx.mealkitIngredient.createMany({
        data: ingredientItems,
      });

      // 밀키트 수정
      return tx.mealkit.update({
        where: {id},
        data: {
          name: updateMealkitDto.name,
          recipe: updateMealkitDto.recipe,
          description: updateMealkitDto.description,
          price: totalPrice
        }
      })
    });
  }

  async remove(id: number, member: AuthMember) {
    // 관리자 권한 확인
    const {role} = await member;
    if(role != 'ADMIN') throw new ForbiddenException(`밀키트 삭제 권한이 없습니다.`);
    // 밀키트 가져오기
    const mealkit = await this.findOne(id);
    // 주문내역이 있으면 삭제 불가능
    if(mealkit.orderCount > 0) throw new BadRequestException(`주문내역이 있는 밀키트는 삭제할 수 없습니다`);
    // 밀키트 삭제
    await this.prisma.$transaction([
      this.prisma.mealkitIngredient.deleteMany({where: {mealkitId: mealkit.id}}),
      this.prisma.mealkit.delete({where: {id}}),
    ])
    return {deleted: id};
  }


  // 밀키트 상세 정보
  async findOneDetail(id:number){
    const mealkit = await this.prisma.mealkit.findUnique({
      where: {id},
      include: {
        chef: {
          select: {
            id: true,
            name: true,
            email: true
          },
        },
        mealkitIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    });
    if(!mealkit) throw new NotFoundException(`밀키트 ${id}를 찾을 수 없습니다`)
    return mealkit;
  }
}
