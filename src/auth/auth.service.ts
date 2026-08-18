import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { MembersService } from "../members/members.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly memberService: MembersService, // 회원 가입 및 찾기 this.prisma.member
    private readonly jwtService: JwtService, // AuthModule
  ) {}

  async register(dto: RegisterDto) {
    // 기존 회원 체크
    const exist = await this.memberService.findByEmail(dto.email);
    if (exist) throw new ConflictException(`이미 가입된 이메일입니다`);

    // 비밀번호 암호화
    const hashed = await bcrypt.hash(dto.password, 10);

    // 유저 생성
    const user = await this.memberService.createMember({
      name: dto.name,
      email: dto.email,
      password: hashed,
      address: dto.address,
      phone: dto.phone,
      role: dto.role ?? "USER",
    });

    // 비밀번호 빼고 나머지 데이터 반환
    const { password, ...result } = await user;
    console.log("---result---", result);
    return result;
  }

  async login(dto: LoginDto) {
    // 이메일로 회원이 있는지 검사
    const user = await this.memberService.findByEmail(dto.email);

    // 사용자가 없거나 비밀번호가 틀리면 예외 발생
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException(`이메일 또는 비밀번호를 확인해주세요`);
    }

    // JWT Payload 생성
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Access Token 발급
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
