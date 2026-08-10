import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";


// /POST /auth/login 요청 본문 : 이메일과 패스워드 인증
export class LoginDto{

  @ApiProperty({example: 'chef@chefuser.com'})
  @IsEmail()
  email: string;

  @ApiProperty({example: 'password1234'})
  @IsString()
  password: string;
}
