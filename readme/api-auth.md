# chefkit API

### <span style="color: red;">**auth**</span>

---

#### **[POST] /auth/register 회원가입**

회원가입을 처리합니다.

이메일 중복 여부를 확인한 후 비밀번호를 bcrypt로 암호화하여 회원을 생성합니다.

> **주의**
>
> - `role`은 `USER` 또는 `CHEF`만 입력할 수 있습니다.
> - `role`을 입력하지 않으면 `USER`로 저장됩니다.
> - `password`는 서버에서 bcrypt로 암호화되어 저장됩니다.
> - 응답에는 비밀번호가 포함되지 않습니다.
> - `ADMIN` 권한으로 회원가입할 수 없습니다.

### Request

```json
{
  "name": "미각쉐프",
  "email": "chef@chefuser.com",
  "password": "password1234",
  "address": "서울특별시",
  "phone": "010-1234-5678",
  "role": "CHEF"
}
```

### Request Params

| key | type | 기본값 | 필수여부 | 설명 |
|---|---|---|---|---|
| name | String | - | 필수 | 회원 이름, 최소 2자 |
| email | String | - | 필수 | 이메일 형식 |
| password | String | - | 필수 | 영문 소문자 + 숫자 포함, 최소 6자 |
| address | String | - | 선택 | 주소, 최소 2자 |
| phone | String | - | 선택 | 대한민국 전화번호 형식 |
| role | USER / CHEF | USER | 선택 | 회원 권한 |

### Response

회원가입 성공 시 생성된 회원 정보를 반환합니다.

```json
{
  "id": 12,
  "name": "미각쉐프",
  "email": "chef@chefuser.com",
  "address": "서울특별시",
  "phone": "010-1234-5678",
  "role": "CHEF",
  "createdAt": "2026-06-25T01:03:11.404Z",
  "updatedAt": "2026-06-25T01:03:11.404Z"
}
```

> `password`는 보안상의 이유로 응답에 포함되지 않습니다.

### 회원가입 실패 - 이메일 중복

이미 가입된 이메일을 사용하는 경우 `409 Conflict`가 발생합니다.

```json
{
  "message": "이미 가입된 이메일입니다",
  "error": "Conflict",
  "statusCode": 409
}
```

### 회원가입 실패 - 잘못된 입력

`class-validator`에 의해 DTO의 유효성 검사가 수행됩니다.

예를 들어 이메일 형식이 잘못되었거나 비밀번호 조건을 만족하지 못하는 경우 `400 Bad Request`가 발생합니다.

```json
{
  "message": [
    "email must be an email"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Password 조건

비밀번호는 다음 조건을 만족해야 합니다.

- 최소 6자 이상
- 영문 소문자 1개 이상
- 숫자 1개 이상
- 대문자는 필수 아님
- 특수문자는 필수 아님

예:

```text
password1234
```

---

#### **[POST] /auth/login 로그인**

이메일과 비밀번호를 이용하여 로그인합니다.

로그인에 성공하면 JWT Access Token을 발급합니다.

### Request

```json
{
  "email": "chef@chefuser.com",
  "password": "password1234"
}
```

### Request Params

| key | type | 기본값 | 필수여부 | 설명 |
|---|---|---|---|---|
| email | String | - | 필수 | 가입한 이메일 |
| password | String | - | 필수 | 회원가입 시 입력한 비밀번호 |

### Response

로그인 성공 시 JWT Access Token을 반환합니다.

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 로그인 실패

존재하지 않는 이메일이거나 비밀번호가 일치하지 않는 경우 `401 Unauthorized`가 발생합니다.

```json
{
  "message": "이메일 또는 비밀번호를 확인해주세요",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Access Token 사용

로그인 성공 후 발급받은 `access_token`은 인증이 필요한 API 요청의 `Authorization` Header에 사용합니다.

```http
Authorization: Bearer {access_token}
```

예:

```http
GET /orders/my
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 인증이 필요한 API

로그인 후 발급받은 JWT Access Token이 필요한 API에서는 다음과 같이 요청합니다.

```http
Authorization: Bearer {access_token}
```

JWT Payload에는 다음 정보가 포함됩니다.

```json
{
  "sub": 12,
  "email": "chef@chefuser.com",
  "role": "CHEF"
}
```

| key | 설명 |
|---|---|
| sub | 로그인한 회원의 id |
| email | 로그인한 회원의 이메일 |
| role | 회원 권한 |

---

## 회원가입 → 로그인 → API 사용 예시

### 1. 회원가입

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "미각쉐프",
  "email": "chef@chefuser.com",
  "password": "password1234",
  "address": "서울특별시",
  "phone": "010-1234-5678",
  "role": "CHEF"
}
```

### 2. 로그인

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "chef@chefuser.com",
  "password": "password1234"
}
```

응답:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. 인증이 필요한 API 요청

```http
GET /orders/chef
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 권한

| Role | 설명 |
|---|---|
| USER | 일반 회원 |
| CHEF | 밀키트를 등록하고 자신의 밀키트 주문을 조회할 수 있는 셰프 |
| ADMIN | 관리자 |

회원가입 API에서는 `USER`, `CHEF`만 지정할 수 있으며 `ADMIN`은 회원가입으로 생성할 수 없습니다.

관리자 계정은 별도로 생성된 계정을 사용합니다.