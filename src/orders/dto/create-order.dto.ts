import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, Min, ValidateNested } from "class-validator";

class CreateOrderItemDto {

  @ApiProperty({example: '1'})
  @IsInt()
  @Min(1)
  mealkitId: number;

  @ApiProperty({example: '1'})
  @IsInt()
  @Min(1)
  quantity: number = 1;
}

export class CreateOrderDto {

  @ApiProperty({
    type: [Number],
    example: [
      { mealkitId: 3, quantity: 2 },
      { mealkitId: 4, quantity: 1 }
    ],
    description: '밀키트 id, 수량 배열'
  })
  @IsArray()
  @ValidateNested({each: true})
  @Type(()=> CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
  
}
