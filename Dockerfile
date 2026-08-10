# 1. Base 이미지 지정
FROM node:20

# 2. 컨테이너 내 작업 디렉터리 설정
WORKDIR /app

# 3. 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 4. 전체 소스코드 복사
COPY . .

# 5. Prisma Client 생성 및 NestJS 앱 빌드
RUN npx prisma generate
RUN npm run build

# 6. 포트 노출
EXPOSE 3000

# 7. 애플리케이션 실행 (NestJS 기본 빌드 경로는 dist/main 입니다)
CMD ["node", "dist/main.js"]