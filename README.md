
# 셰프의 밀키트(ChefKit) - Backend 

## 프로젝트 소개
관리자가 등록해둔 재료 정보를 바탕으로 셰프로 등록된 회원이 밀키트를 구성하여 판매하고 회원이 밀키트를 구매할 수 있는 기능 구현

### 주요 기능
* 회원 가입/로그인
* 재료 등록(관리자)
* 재료 목록 조회(관리자/셰프)
* 밀키트 등록(관리자/셰프)
* 밀키트 주문
* 주문 목록 조회(관리자/회원)
* 내 회원 정보 수정
* 비밀번호 변경
* 회원 정보 수정(관리자)

<br>

## APIs
작성한 API는 아래에서 확인할 수 있습니다

[Auth API 바로보기](./readme/api-auth.md)<br/>
[회원 API 바로보기](./readme/api-member.md)<br/>
[재료 API 바로보기](./readme/api-ingredients.md)<br/>
[밀키트 API 바로보기](./readme/api-member.md)<br/>


## 기술 스택
<div>
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" style="border-radius: 3px">
<img src="https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=Nestjs&logoColor=white" style="border-radius: 3px">
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white" style="border-radius: 3px">
<img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" style="border-radius: 3px">
<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white" style="border-radius: 3px">
</div>

<br>

## 프로젝트 구조
```text
chefkit/
├── prisma/
├── src/
│   ├── auth/
│   ├── common/
│   ├── ingredients/
│   ├── mealkits/
│   ├── members/
│   ├── orders/
│   └── prisma/
└── main.ts
```


<br>

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/kongdeis/pf-chefkit-backend.git
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일 생성

```env
DATABASE_URL=
PORT=
JWT_SECRET=
ADMIN_INIT_PASSWORD=
```

| 변수명             | 설명           |
| --------------- | ------------ |
| DATABASE_URL    | 데이터베이스 연결 주소 |
| PORT            | 포트 번호 |
| JWT_SECRET | 인증 시크릿 키     |
| ADMIN_INIT_PASSWORD    | 관리자 계정 초기 비밀번호      |

---

### 4. 개발 서버 실행

```bash
npm run start:dev
```

### 5. 브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```


### 6. 빌드

```bash
npm run build
```

---

<br>

## 개발자

* kongdeis


