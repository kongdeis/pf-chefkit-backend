import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PageRequestDto } from '../../common/dto/page-request.dto';

export class SearchMealkitDto extends PageRequestDto {

  @IsOptional()
  @IsIn([
    'latest',
    'oldest',
    'priceHigh',
    'priceLow',
    'popular',
  ])
  sort?: string;
  
  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  search?: string;
}