import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthMember } from '../common/current-member.decorator';
import { SearchIngredientDto } from './dto/search-ingredient.dto';
import { contains } from 'class-validator';


@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService){}


  // 재료 등록은 관리자만 가능
  async create(createIngredientDto: CreateIngredientDto, member: AuthMember) {
    // 관리자 권한 확인
    const {role} = await member;
    if(role != 'ADMIN') throw new ForbiddenException(`재료 등록 권한이 없습니다.`)

    // 등록된 재료인지 확인
    const exist = await this.prisma.ingredient.findUnique({
      where: {
        name_location: {
          name: createIngredientDto.name,
          location: createIngredientDto.location
        }
      }
    });
    if(exist) throw new ConflictException(`이미 등록된 재료입니다`)
    return this.prisma.ingredient.create({data: createIngredientDto});
  }

  async findAll(member: AuthMember, query: SearchIngredientDto) {
    // 관리자or쉐프 권한 확인
    const {role} = member;
    const allowedRoles = ['ADMIN', 'CHEF'];
    if(!allowedRoles.includes(role)) throw new ForbiddenException(`재료 열람 권한이 없습니다.`)

    const where: any = {};
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;


    let orderBy: any = { updatedAt: 'desc' };

    switch (query.sort) {
      case 'createOldest':
        orderBy = { createdAt: 'asc' };
        break;

      case 'updateOldest':
        orderBy = { updatedAt: 'asc' };
        break;

      case 'createLatest':
        orderBy = { createdAt: 'desc' };
        break;

      case 'updateLatest':
        orderBy = { updatedAt: 'desc' };
        break;

      case 'priceHigh':
        orderBy = { unitPrice: 'desc' };
        break;

      case 'priceLow':
        orderBy = { unitPrice: 'asc' };
        break;

      default:
        orderBy = { updatedAt: 'desc' };
    }

    if(query.name){
      where.name = {contains:query.name, mode: 'insensitive'};
    }

    if(query.location){
      where.location = {contains: query.location, mode: 'insensitive'};
    }

    const [items, total] = await Promise.all([
      this.prisma.ingredient.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ingredient.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOneAuth(id: number, member: AuthMember){
    // 관리자or쉐프 권한 확인
    const {role} = member;
    const allowedRoles = ['ADMIN', 'CHEF'];
    if(!allowedRoles.includes(role)) throw new ForbiddenException(`재료 열람 권한이 없습니다.`)
    return this.findOne(id);
  }

  findOne(id: number) {
    const ingredient = this.prisma.ingredient.findUnique({
      where: {id}
    })
    if(!ingredient) throw new NotFoundException(`재료 아이디 ${id} 찾을 수 없습니다`)
    return ingredient;
  }

  async update(
    id: number,
    dto: UpdateIngredientDto,
    member: AuthMember,
  ) {
    if (member.role !== 'ADMIN') {
      throw new ForbiddenException('재료 수정 권한이 없습니다.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 현재 데이터 조회
      const ingredient = await tx.ingredient.findUnique({
        where: { id },
      });

      if (!ingredient) {
        throw new NotFoundException('재료를 찾을 수 없습니다.');
      }

      // 최종 값 계산
      const newName = dto.name ?? ingredient.name;
      const newLocation = dto.location ?? ingredient.location;
      const newUnitPrice = dto.unitPrice ?? ingredient.unitPrice;

      // name/location 변경 여부 판단
      const isNameChanged = dto.name !== undefined;
      const isLocationChanged = dto.location !== undefined;

      // 중복 검사 (변경된 경우만)
      if (isNameChanged || isLocationChanged) {
        const exists = await tx.ingredient.findFirst({
          where: {
            name: newName,
            location: newLocation,
            NOT: {
              id,
            },
          },
        });

        if (exists) {
          throw new ConflictException('이미 등록된 재료입니다.');
        }
      }

      // 업데이트
      const updated = await tx.ingredient.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.location !== undefined && { location: dto.location }),
          ...(dto.unit !== undefined && { unit: dto.unit }),
          ...(dto.unitPrice !== undefined && { unitPrice: dto.unitPrice }),
        },
      });

      // 가격 변경 시만 영향 반영
      const isPriceChanged = dto.unitPrice !== undefined;

      if (isPriceChanged) {
        const affected = await tx.mealkitIngredient.findMany({
          where: { ingredientId: id },
        });

        const mealkitIds = [...new Set(affected.map(i => i.mealkitId))];

        for (const mealkitId of mealkitIds) {
          const items = await tx.mealkitIngredient.findMany({
            where: { mealkitId },
          });

          let total = 0;

          for (const item of items) {
            const price =
              item.ingredientId === id
                ? newUnitPrice * item.quantity
                : item.price;

            total += price;

            await tx.mealkitIngredient.update({
              where: {
                mealkitId_ingredientId: {
                  mealkitId: item.mealkitId,
                  ingredientId: item.ingredientId,
                },
              },
              data: { price },
            });
          }

          await tx.mealkit.update({
            where: { id: mealkitId },
            data: { price: total },
          });
        }
      }

      return updated;
    });
  }

  async remove(id: number, member: AuthMember) {
    // 관리자 권한 확인
    const {role} = await member;
    if(role != 'ADMIN') throw new ForbiddenException(`재료 삭제 권한이 없습니다.`);
    // 재료 확인
    await this.findOne(id);
    // 사용된 밀키트가 있는지 확인
    const used = await this.prisma.mealkitIngredient.findMany({
      where : {ingredientId: id},
      select: {
        mealkitId: true
      }
    });
    // 사용중이면 삭제 금지
    if(used.length > 0){
      const mealkitIds = [...new Set(used.map((u)=>u.mealkitId))];
      throw new ConflictException({
        message: '이 재료를 사용하는 밀키트가 있어 삭제할 수 없습니다',
        mealkitIds
      })
    }
    await this.prisma.ingredient.delete({where: {id}});
    return {deleted: id};
  }
}
