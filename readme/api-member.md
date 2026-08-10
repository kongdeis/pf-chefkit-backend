# chefkit API


### <span style="color: red;">**member**</span>

#### **[GET]** /member 회원검색 (ADMIN)
**Params**
|key  | type | 기본값 | 필수여부|
|----| ---| ----|---|
|page | Int | 1   | 
|limit | Int |  10 | 
|role | [user, chef, admin] | | 
|name | String | |

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
          "uuid": ${uuid},
          "address": "서울특별시",
          "phone": "010-1234-5678",
          "role": "USER",
          "createdAt": "2026-06-18T06:02:22.510Z",
          "updatedAt": "2026-06-22T06:42:43.948Z"
      },
      .
      .
      {
        "id": 10,
        "name": "대가족",
        "email": "greateuser@user.com",
        "uuid": ${uuid},
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

#### **[GET]** /member/admin/:id 회원검색 (ADMIN)
**Response**
```json
{
  "message": "success",
  "statusCode": 200,
  "chefkit": {
    "id": 1,
    "name": "회원1",
    "email": "chef@chefuser.com",
    "uuid": ${uuid},
    "address": "서울특별시",
    "phone": "010-1234-5678",
    "role": "USER",
    "createdAt": "2026-06-18T06:02:22.510Z",
    "updatedAt": "2026-06-22T06:42:43.948Z"
}
}
```
<br/>

#### **[PATCH]** /member/admin/:id 회원정보 수정 (ADMIN)
**Request**
```json
{
  "name": "최고미각소유자"
}
```
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "id": 1,
        "name": "최고미각소유자",
        "email": "chef@chefuser.com",
        "uuid": ${uuid},
        "address": "서울특별시",
        "phone": "010-1234-5678",
        "role": "USER",
        "createdAt": "2026-06-18T06:02:22.510Z",
        "updatedAt": "2026-06-26T01:21:03.565Z"
    }
}
```
<br/>

#### **[PATCH]** /member/myinfo 로그인한 회원정보 수정
**Request**
```json
{
  "name": "최고미각소유자"
}
```
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "id": 1,
        "name": "최고미각소유자",
        "email": "chef@chefuser.com",
        "uuid": ${uuid},
        "address": "서울특별시",
        "phone": "010-1234-5678",
        "role": "USER",
        "createdAt": "2026-06-18T06:02:22.510Z",
        "updatedAt": "2026-06-26T01:21:03.565Z"
    }
}
```
<br/>
