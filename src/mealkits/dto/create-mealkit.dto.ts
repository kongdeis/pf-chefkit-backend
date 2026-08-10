import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsString, MaxLength, Min, MinLength, ValidateNested } from "class-validator";


class CreateMealkitIngredientDto {

  @ApiProperty({example: '1'})
  @IsInt()
  @Min(1)
  ingredientId: number;

  @ApiProperty({example: '1'})
  @IsInt()
  @Min(1)
  quantity: number;
}


export class CreateMealkitDto {

  @ApiProperty({example: '김치찌개'})
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({example: '1. 돼지고기를 참기름에 볶는다. 2. 신김치와 양파를 넣고 함께 볶는다. 3. 육수를 붓고 대파와 마늘을 넣어 푹 끓인다.'})
  @IsString()
  @MinLength(2)
  recipe: string;

  @ApiProperty({example: '깊은 맛의 육수와 묵은지가 어우러진 밥도둑 김치찌개'})
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  description: string;

  @ApiProperty(
    {type: [Number], 
    example: [
      { ingredientId: 1, quantity: 3 },
      { ingredientId: 4, quantity: 10 }
    ], 
    description: '재료 id, 수량 배열'}
  )
  @IsArray()
  @ValidateNested({each: true})
  @Type(()=> CreateMealkitIngredientDto)
  mealkitIngredients: CreateMealkitIngredientDto[]

}
