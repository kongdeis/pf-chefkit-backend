import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @ApiOperation({summary: '회원가입'})
  @Post('register')
  register(@Body() dto: RegisterDto){
    return this.authService.register(dto)
  }

  @ApiOperation({summary: '로그인'})
  @Post('login')
  login(@Body() dto: LoginDto){
    return this.authService.login(dto);
  }
}
