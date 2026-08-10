import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateIngredientDto {

  @ApiProperty({example: '대파', minLength: 2, maxLength: 50})
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({example: '강원도', minLength: 2, maxLength: 50})
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  location: string;

  @ApiProperty({enum: ['EA', 'G1', 'G10', 'G100', 'KG1']})
  @IsIn(['EA', 'G1', 'G10', 'G100', 'KG1'])
  unit: 'EA' | 'G1' | 'G10' | 'G100' | 'KG1';

  @ApiProperty({example: 1000})
  @Type(() => Number)
  @IsInt()
  @Min(0)
  unitPrice: number;

}
