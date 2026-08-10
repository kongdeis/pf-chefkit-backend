import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-member.dto';
import { IsString, IsStrongPassword } from 'class-validator';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}


export class ChangePasswordDto {
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
      message: '비밀번호는 영문, 숫자 포함 최소 6자 이상).',
    },
  )
  currentPassword: string;
  
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
      message: '비밀번호는 영문, 숫자 포함 최소 6자 이상).',
    },
  )
  newPassword: string;
}