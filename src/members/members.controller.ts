import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto, ChangePasswordDto } from './dto/update-member.dto';
import { type AuthMember, CurrentMember } from '../common/current-member.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SearchMemberDto } from './dto/search-member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // @Post()
  // create(@Body() createMemberDto: CreateMemberDto) {
  //   return this.membersService.create(createMemberDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '회원정보 조회는 관리자만 가능'})
  findAll(@Query() query: SearchMemberDto, @CurrentMember() member: AuthMember) {
    return this.membersService.findAll(query, member);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '회원정보 조회는 관리자만 가능'})
  findOneAdmin(@Param('id') id: string, @CurrentMember() member: AuthMember) {
    return this.membersService.findOneAdmin(+id, member);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '다른 회원의 정보 수정은 관리자만 가능, 비밀번호는 불가능'})
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto, @CurrentMember() member: AuthMember) {
    return this.membersService.updateAdmin(+id, updateMemberDto, member);
  }


  @Patch('myinfo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '로그인한 회원 정보 수정'})
  updateMy(
    @Body() updateMemberDto: UpdateMemberDto, 
    @CurrentMember() member: AuthMember
  ) {
    return this.membersService.updateMy(updateMemberDto, member);
  }

  @Patch('myinfo/changePw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '로그인한 회원 비밀번호 변경'})
  changeMyPassword(
    @Body() dto: ChangePasswordDto, 
    @CurrentMember() member: AuthMember
  ){
    return this.membersService.changeMyPassword(dto, member);
  }


  @Delete('myinfo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '로그인한 회원 정보 삭제'})
  removeMy(@CurrentMember() member: AuthMember) {
    return this.membersService.removeMy(member);
  }


  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '관리자가 특정 회원 정보 삭제'})
  remove(@Param('id') id: string, @CurrentMember() member: AuthMember) {
    return this.membersService.removeAdmin(+id, member);
  }

}
