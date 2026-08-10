import { PartialType } from '@nestjs/swagger';
import { CreateMealkitDto } from './create-mealkit.dto';

export class UpdateMealkitDto extends PartialType(CreateMealkitDto) {}
