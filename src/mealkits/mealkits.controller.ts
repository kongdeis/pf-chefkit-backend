import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { MealkitsService } from './mealkits.service';
import { CreateMealkitDto } from './dto/create-mealkit.dto';
import { UpdateMealkitDto } from './dto/update-mealkit.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { type AuthMember, CurrentMember } from '../common/current-member.decorator';
import { SearchMealkitDto } from './dto/search-mealkit.dto';

@Controller('mealkits')
export class MealkitsController {
  constructor(private readonly mealkitsService: MealkitsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '밀키트 등록은 관리자, 쉐프만 가능'})
  create(@Body() createMealkitDto: CreateMealkitDto, @CurrentMember() member: AuthMember) {
    return this.mealkitsService.create(createMealkitDto, member);
  }

  @Get()
  @ApiOperation({summary: '밀키트 목록'})
  findAll(@Query() query: SearchMealkitDto) {
    return this.mealkitsService.findAll(query);
  }

  @Get('/chef')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '밀키트 목록'})
  findChef(@Query() query: SearchMealkitDto, @CurrentMember() member: AuthMember) {
    return this.mealkitsService.findChef(query, member);
  }


  @Get(':id')
  @ApiOperation({summary: '밀키트 상세 정보'})
  findOneDetail(@Param('id', ParseIntPipe) id: number) {
    return this.mealkitsService.findOneDetail(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '밀키트 수정은 관리자와 등록한 쉐프만 가능'})
  update(@Param('id') id: string, @Body() updateMealkitDto: UpdateMealkitDto, @CurrentMember() member: AuthMember) {
    return this.mealkitsService.update(+id, updateMealkitDto, member);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '밀키트 삭제는 관리자만 가능'})
  remove(@Param('id') id: string, @CurrentMember() member: AuthMember) {
    console.log('remove 진입');
    console.log(id, member)
    return this.mealkitsService.remove(+id, member);
  }
}
