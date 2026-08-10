import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from "class-validator";

export class RegisterDto {

  @ApiProperty({example: '미각쉐프'})
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({example: 'chef@chefuser.com'})
  @IsEmail()
  email: string;

  @ApiProperty({example: 'password1234'})
  @IsString()
  @IsStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message: '비밀번호는 영문 소문자, 숫자 포함 최소 6자 이상).',
    },
  )
  password: string;

  @ApiProperty({example: '서울특별시'})
  @IsOptional()
  @IsString()
  @MinLength(2)
  address: string;

  @ApiProperty({example: '010-1234-5678'})
  @IsOptional()
  @IsString()
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({enum: ['USER', 'CHEF'], default: 'USER'})
  @IsOptional()
  @IsIn(['USER', 'CHEF'])
  role?: 'USER' | 'CHEF';
}
