
// JWT 시크릿은 환경변수에서 가져와서 단일 출처로 사용하기 위해서
// 운영에서는 dev-secret-change-me를 .env에서 바꿔서 사용
export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? "dev-secret-change-me"
}
