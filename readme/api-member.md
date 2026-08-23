# **chefkit API**

### <span style="color: red;">**member**</span>

#### **[GET] /members 회원검색 (ADMIN)**

**Params**

| key   | type               | 기본값 | 필수여부 |
| ----- | ------------------ | ------ | -------- |
| page  | Int                | 1      |          |
| limit | Int                | 10     |          |
| role  | [USER, CHEF, ADMIN] |        |          |
| name  | String             |        |          |

**권한**

- ADMIN

**Response**

```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "items": [
      {
        "id": 1,
        "name": "회원1",
        "email": "chef@chefuser.com",
        "uuid": "${uuid}",
        "address": "서울특별시",
        "phone": "010-1234-5678",
        "role": "USER",
        "createdAt": "2026-06-18T06:02:22.510Z",
        "updatedAt": "2026-06-22T06:42:43.948Z"
      },
      {
        "id": 10,
        "name": "대가족",
        "email": "greateuser@user.com",
        "uuid": "${uuid}",
        "address": "강원도",
        "phone": "010-1234-5678",
        "role": "USER",
        "createdAt": "2026-06-20T23:15:28.020Z",
        "updatedAt": "2026-06-20T23:15:28.020Z"
      }
    ],
    "total": 11,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

<br/>

#### **[GET] /members/admin/:id 회원검색 (ADMIN)**

**권한**

- ADMIN

**Response**

```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "id": 1,
    "name": "회원1",
    "email": "chef@chefuser.com",
    "uuid": "${uuid}",
    "address": "서울특별시",
    "phone": "010-1234-5678",
    "role": "USER",
    "createdAt": "2026-06-18T06:02:22.510Z",
    "updatedAt": "2026-06-22T06:42:43.948Z"
  }
}
```

<br/>

#### **[PATCH] /members/admin/:id 회원정보 수정 (ADMIN)**

관리자가 다른 회원의 정보를 수정합니다.  
비밀번호는 관리자가 수정할 수 없습니다.

**권한**

- ADMIN

**Request**

```json
{
  "name": "최고미각소유자"
}
```

**Response**

```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "id": 1,
    "name": "최고미각소유자",
    "email": "chef@chefuser.com",
    "uuid": "${uuid}",
    "address": "서울특별시",
    "phone": "010-1234-5678",
    "role": "USER",
    "createdAt": "2026-06-18T06:02:22.510Z",
    "updatedAt": "2026-06-26T01:21:03.565Z"
  }
}
```

<br/>

#### **[PATCH] /members/myinfo 로그인한 회원정보 수정**

로그인한 회원 자신의 정보를 수정합니다.

**권한**

- USER
- CHEF
- ADMIN

**Request**

```json
{
  "name": "최고미각소유자"
}
```

**Response**

```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "id": 1,
    "name": "최고미각소유자",
    "email": "chef@chefuser.com",
    "uuid": "${uuid}",
    "address": "서울특별시",
    "phone": "010-1234-5678",
    "role": "USER",
    "createdAt": "2026-06-18T06:02:22.510Z",
    "updatedAt": "2026-06-26T01:21:03.565Z"
  }
}
```

<br/>

#### **[PATCH] /members/myinfo/changePw 로그인한 회원 비밀번호 변경**

로그인한 회원 자신의 비밀번호를 변경합니다.

**권한**

- USER
- CHEF
- ADMIN

**Request**

```json
{
  "currentPassword": "password1234",
  "newPassword": "newpassword1234"
}
```

<br/>

#### **[DELETE] /members/myinfo 로그인한 회원 정보 삭제**

로그인한 회원 자신의 계정을 삭제합니다.

**권한**

- USER
- CHEF
- ADMIN

**Response**

```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "deleted": 1
  }
}
```

<br/>

#### **[DELETE] /members/admin/:id 회원 정보 삭제 (ADMIN)**

관리자가 특정 회원의 정보를 삭제합니다.

**권한**

- ADMIN

**Response**

```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "deleted": 1
  }
}
```

<br/>

---

## DTO

### **CreateMemberDto**

회원 생성에 사용되는 DTO입니다.

| key      | type         | 필수여부 | 설명 |
| -------- | ------------ | -------- | ---- |
| name     | String       | O        | 회원 이름, 최소 2자 |
| email    | String       | O        | 이메일 형식 |
| password | String       | O        | 영문/숫자 포함 최소 6자 |
| address  | String       | X        | 주소, 최소 2자 |
| phone    | String       | X        | 대한민국 전화번호 |
| role     | USER \| CHEF | X        | 기본값 USER |

**Validation**

- `name`
  - String
  - 최소 2자
- `email`
  - Email 형식
- `password`
  - Strong Password
  - 최소 6자
  - 영문 소문자 1자 이상
  - 숫자 1자 이상
- `address`
  - Optional
  - String
  - 최소 2자
- `phone`
  - Optional
  - 한국 전화번호 형식
- `role`
  - Optional
  - `USER` 또는 `CHEF`

**Example**

```json
{
  "name": "미각셰프",
  "email": "chef@chefuser.com",
  "password": "password1234",
  "address": "서울특별시",
  "phone": "010-1234-5678",
  "role": "CHEF"
}
```


<br/>

### **SearchMemberDto**

회원 검색에 사용되는 DTO입니다.

`PageRequestDto`를 상속하여 페이지네이션 기능을 사용합니다.

| key   | type                | 기본값 | 필수여부 | 설명 |
| ----- | ------------------- | ------ | -------- | ---- |
| page  | Int                 | 1      | X        | 페이지 번호 |
| limit | Int                 | 10     | X        | 페이지당 조회 수 |
| role  | USER / CHEF / ADMIN |        | X        | 회원 역할 필터 |
| name  | String              |        | X        | 회원 이름 검색 |

**role 처리**

입력된 `role`은 대문자로 변환한 후 Prisma의 `Role` Enum으로 검증합니다.

예:

```text
?role=user
```

```text
USER
```

<br/>

## API 인증

인증이 필요한 API는 JWT 인증을 사용합니다.

```text
Authorization: Bearer <JWT>
```

Controller에서는 다음 Guard를 사용합니다.

```ts
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
```

<br/>

## 권한 정리

| API | USER | CHEF | ADMIN |
| --- | ---- | ---- | ----- |
| GET /members | X | X | O |
| GET /members/admin/:id | X | X | O |
| PATCH /members/admin/:id | X | X | O |
| PATCH /members/myinfo | O | O | O |
| PATCH /members/myinfo/changePw | O | O | O |
| DELETE /members/myinfo | O | O | O |
| DELETE /members/admin/:id | X | X | O |

<br/>

## Controller API 목록

```text
GET     /members
GET     /members/admin/:id
PATCH   /members/admin/:id
PATCH   /members/myinfo
PATCH   /members/myinfo/changePw
DELETE  /members/myinfo
DELETE  /members/admin/:id
```