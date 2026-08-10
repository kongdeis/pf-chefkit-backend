import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// @UseGuard(JwtAuthGuard)
// AuthGuard('jwt') -> JwtStrategy를 찾아서 jwt 전략을 돌린다
// 성공하면 req.user 에 채워지고, 실패하면 401 Unauthorizated
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}
