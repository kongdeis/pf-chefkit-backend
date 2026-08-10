
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Role } from "@prisma/client"


export interface AuthMember {
  id: number;
  email: string;
  role: Role;
}

// decorator
export const CurrentMember = createParamDecorator((
  field: keyof AuthMember,  // id, email, role
  ctx: ExecutionContext
) => {
  // Http 요청 객체(req)를 꺼낸다. from NESTJS 요청 컨텍스트에서
  const request = ctx.switchToHttp().getRequest();
  // JWTStrategy.validate 가 채워둔 사용자 정보를 꺼낸다
  const member: AuthMember = request.user;
  // field가 있으면 한 필드만, 없으면 객체 전체 반환
  // @CurrentMember("id") --> member.id
  // @CurrentMember()     --> member (전체)
  return field ? member?.[field] : member;
})

