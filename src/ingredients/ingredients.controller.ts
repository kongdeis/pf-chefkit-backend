import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { type AuthMember, CurrentMember } from '../common/current-member.decorator';
import { SearchIngredientDto } from './dto/search-ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '재료 등록은 관리자만 가능'})
  create(@Body() createIngredientDto: CreateIngredientDto, @CurrentMember() member: AuthMember) {
    return this.ingredientsService.create(createIngredientDto, member);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '재료 확인은 관리자,쉐프만 가능'})
  findAll(@CurrentMember() member, @Query() query: SearchIngredientDto) {
    return this.ingredientsService.findAll(member, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @CurrentMember() member: AuthMember) {
    return this.ingredientsService.findOneAuth(+id, member);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '재료 수정은 관리자만 가능'})
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto, @CurrentMember() member: AuthMember) {
    return this.ingredientsService.update(+id, updateIngredientDto, member);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: '재료 삭제는 관리자만 가능, 등록된 밀키트 있으면 삭제 불가'})
  remove(@Param('id') id: string, @CurrentMember() member: AuthMember) {
    return this.ingredientsService.remove(+id, member);
  }
}
