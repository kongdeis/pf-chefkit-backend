
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsOptional, Min } from "class-validator";
import { OrderStatus } from '@prisma/client';
import { PageRequestDto } from "../../common/dto/page-request.dto";


export class SearchOrderDto extends PageRequestDto {

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  memberId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  chefId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mealkitId?: number;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderByDate?: 'asc' | 'desc';

}
