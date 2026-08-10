# chefkit API


### <span style="color: red;">**auth**</span>

#### **[POST]** /auth/register 회원가입
**Request**
```json
{
  "name": "나도요리사",
  "email": "mechef@chefuser.com",
  "password": "password1234",
  "address": "경기도",
  "phone": "010-1234-5678",
  "role": "CHEF"
}
```
**Response**
```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "id": 12,
    "name": "나도요리사",
    "email": "mechef@chefuser.com",
    "uuid": "2be9a294-b5c3-4c86-9ee1-573b12068553",
    "address": "경기도",
    "phone": "010-1234-5678",
    "role": "CHEF",
    "createdAt": "2026-06-25T01:03:11.404Z",
    "updatedAt": "2026-06-25T01:03:11.404Z"
  }
}
{
  "message": "이미 가입된 이메일입니다",
  "error": "Conflict",
  "statusCode": 409
}
```


#### **[POST]** /auth/login 로그인
**Request**
```json
{
  "email": "testuser@useruser.com",
  "password": "password1234"
}
```
**Response**
```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "access_token": ${token}$
  }
}
{
  "message": "이메일 또는 비밀번호를 확인해주세요",
  "error": "Unauthorized",
  "statusCode": 401
}
```

