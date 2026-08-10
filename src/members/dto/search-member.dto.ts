import { Role } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";
import { PageRequestDto } from "../../common/dto/page-request.dto";


export class SearchMemberDto extends PageRequestDto {

  @IsOptional()
  @IsEnum(Role)
  @Transform(({ value }) => value?.toUpperCase())
  role?: string;

  @IsOptional()
  @IsString()
  name?: string;
  
}
