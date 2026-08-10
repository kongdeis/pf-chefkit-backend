
// JWT 전략
// passport strategy를 상속받아서 해당되는 내용만 구현
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";

export class JwtStrategy extends PassportStrategy(Strategy){

  constructor(){
    super({
      // Authorization : Bearer <토큰> -> 헤더에서 jwt 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰은 거부한다 (AuthModule signOption.expiresIn)
      ignoreExpiration: false,
      // 로그인 시에 sign()에 쓴 secret과 동일해야 검증 성공
      secretOrKey: jwtConstants.secret
    });
  }

  // passport-jwt가 서명 완료된 걸 확인한 뒤에 payload를 넘긴다
  // 반환값은 req.user가 된다. req.user를 뽑아서 쓰면 아래 return을 그대로 볼 수 있다
  validate(payload: any) {
    return {id: payload.sub, email: payload.email, role: payload.role}
  }

}

