import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { ChangePasswordDto, UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt'
import { AuthMember } from '../common/current-member.decorator';
import { SearchMemberDto } from './dto/search-member.dto';
import { contains } from 'class-validator';
import { resourceUsage } from 'process';

@Injectable()
export class MembersService {

  constructor(
    private readonly prisma: PrismaService
  ){}


  // async create(createMemberDto: CreateMemberDto) {
  //   return 'This action adds a new member';
  // }

  async findAll(query: SearchMemberDto, member) {
    // 관리자 권한 확인
    if(member.role !== 'ADMIN') throw new ForbiddenException(`회원 조회 권한이 없습니다.`)
  
    const where: any = {};
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    if(query.name){
      where.name = {contains: query.name, mode: 'insensitive'}
    }

    if(query.role){
      where.role = query.role
    }

    const [items, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        // orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.member.count(),
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
    const user = await this.prisma.member.findUnique({where: {id}});
    if(!user) throw new NotFoundException(`회원을 찾을 수 없습니다`);
    return user;
  }

  // id값의 회원 정보 조회
  async findOneAdmin(id: number, member: AuthMember) {
    // 관리자 권한 확인
    if(member.role !== 'ADMIN') throw new ForbiddenException(`회원 조회 권한이 없습니다.`)
    return await this.findOne(id);
  }

  // id값의 회원 정보 수정
  async update(id: number, updateMemberDto: UpdateMemberDto) {
    // 회원 검색
    await this.findOne(id);
    const data = {...updateMemberDto};
    if(data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }
    return await this.prisma.member.update({where: {id}, data});
  }

  // 내 회원정보 수정
  async updateMy(updateMemberDto: UpdateMemberDto, member: AuthMember){
    const data = { ...updateMemberDto };
    if(data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }
    return this.update(member.id, data);
  }

  // 내 비밀번호 수정
  async changeMyPassword(dto: ChangePasswordDto, member: AuthMember){
    const {currentPassword, newPassword} = dto;
    // 저장된 비밀번호 가져오기
    const user = await this.prisma.member.findUnique({
      where: {id: member.id},
      select: {password: true}
    })
    // 현재 비밀번호 확인하기
    if(!user || !(await bcrypt.compare(currentPassword, user.password))){
      throw new UnauthorizedException(`비밀번호가 일치하지 않습니다`)
    }
    // 새로운 비밀번호 저장하기
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.member.update({
      where: {id: member.id}, data: {password: hashed}
    })
    return {result: true};
  }


  // 관리자가 특정회원정보 수정
  async updateAdmin(id: number, updateMemberDto: UpdateMemberDto, member: AuthMember){
    // 관리자 권한 확인
    if(member.role !== 'ADMIN') throw new ForbiddenException(`회원 조회 권한이 없습니다.`)
    // 회원 검색
    await this.findOne(id);
    const data = {...updateMemberDto};
    // 비밀번호는 수정 불가
    if(data.password !== undefined) {
      throw new BadRequestException(`비밀번호는 관리자자가 수정할 수 없습니다`)
    }
    return await this.prisma.member.update({where: {id}, data});
  }

  // 관리자가 특정회원정보 삭제
  async removeAdmin(id: number, member: AuthMember){
    // 관리자 권한 확인
    if(member.role !== 'ADMIN') throw new ForbiddenException(`회원 삭제 권한이 없습니다.`)

    // 삭제 유저 확인
    const revoveUser = await this.findOne(id);
    if(revoveUser.role === 'ADMIN' && revoveUser.email === 'admin@chefkit.com') {
      throw new ForbiddenException(`최고관리자는 삭제할 수 없습니다`)
    }
  
    await this.prisma.member.delete({where: {id}});
    return {deleted: id};
  }

  // 로그인한 본인 회원 삭제
  async removeMy(member: AuthMember){
    if(member.role === 'ADMIN' && member.email === 'admin@chefkit.com') {
      throw new ForbiddenException(`최고관리자는 삭제할 수 없습니다`)
    }
    // 쉐프회원인 경우 등록된 밀키트가 있으면 삭제 불가
    if(['CHEF', 'ADMIN'].includes(member.role)){
      const mealkitCount = await this.prisma.mealkit.count({
        where: {chefId: member.id}
      });
      if(mealkitCount > 0) {
        throw new ConflictException(`등록된 밀키트가 있는 쉐프는 삭제할 수 없습니다`)
      }
    }
    // 주문내역이 있는 경우 삭제 불가
    const orderCount = await this.prisma.order.count({
      where: {memberId: member.id}
    });
    if(orderCount > 0) {
      throw new ConflictException(`주문내역이 있는 회원은 삭제할 수 없습니다`)
    }
    return this.removeOne(member.id);
  }



  // 회원 1명 삭제
  async removeOne(id: number) {
    await this.findOne(id);
    await this.prisma.member.delete({where: {id}});
    return {deleted: id};
  }



  // 회원가입 시 사용
  async createMember(
    data : {
      name: string, 
      email: string,
      password: string,
      address: string,
      phone: string,
      role: Role
    }
  ){
    return this.prisma.member.create({data});
  }

  // 회원찾기
  async findByEmail(email: string){
    return this.prisma.member.findUnique({where: {email}})
  }

  
}
