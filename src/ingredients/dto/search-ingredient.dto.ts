import { IsIn, IsOptional, IsString } from "class-validator";
import { PageRequestDto } from "../../common/dto/page-request.dto";

export class SearchIngredientDto extends PageRequestDto {
  @IsOptional()
  @IsIn([
    "createOldest",
    "updateOldest",
    "createLatest",
    "updateLatest",
    "priceHigh",
    "priceLow",
  ])
  sort?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
