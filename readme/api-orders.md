# **chefkit API**

### **<span style="color: red;">**orders**</span>**

---

#### **[POST] /orders 주문 생성**

로그인한 회원이 밀키트를 주문합니다.

JWT 인증이 필요합니다.

**Headers**

| key | type | 필수여부 |
| --- | --- | --- |
| Authorization | String | O |

```text
Authorization: Bearer {accessToken}
```

**Request Body**

| key | type | 기본값 | 필수여부 | 설명 |
| --- | --- | --- | --- | --- |
| orderItems | Array |  | O | 주문할 밀키트 목록 |
| orderItems[].mealkitId | Int |  | O | 밀키트 ID |
| orderItems[].quantity | Int | 1 | O | 주문 수량 |

**Request**

```json
{
  "orderItems": [
    {
      "mealkitId": 3,
      "quantity": 2
    },
    {
      "mealkitId": 4,
      "quantity": 1
    }
  ]
}
```

**Response**

```json
{
  "id": 106,
  "memberId": 6,
  "totalPrice": 81600,
  "status": "PENDING",
  "orderedAt": "2026-08-23T12:00:00.000Z",
  "orderItems": [
    {
      "id": 7,
      "orderId": 106,
      "mealkitId": 3,
      "quantity": 2,
      "unitPrice": 29800,
      "mealkit": {
        "id": 3,
        "chefId": 3,
        "name": "완도 활전복 & 표고버섯 버터솥밥 키트",
        "recipe": "...",
        "description": "...",
        "price": 29800,
        "orderCount": 69,
        "createdAt": "2026-01-22T13:00:00.000Z",
        "updatedAt": "2026-08-23T12:00:00.000Z"
      }
    },
    {
      "id": 8,
      "orderId": 106,
      "mealkitId": 4,
      "quantity": 1,
      "unitPrice": 21900,
      "mealkit": {
        "id": 4,
        "chefId": 4,
        "name": "스타일리시셰프의 화이트와인 봉골레 생파스타",
        "recipe": "...",
        "description": "...",
        "price": 21900,
        "orderCount": 85,
        "createdAt": "2026-01-26T14:00:00.000Z",
        "updatedAt": "2026-08-23T12:00:00.000Z"
      }
    }
  ]
}
```

**처리 내용**

1. 주문할 밀키트 ID를 확인합니다.
2. 존재하지 않는 밀키트가 포함되어 있으면 주문을 생성하지 않습니다.
3. DB에 저장된 현재 밀키트 가격을 기준으로 주문 금액을 계산합니다.
4. `Order`를 생성합니다.
5. `OrderItem`을 생성합니다.
6. 주문한 밀키트의 `orderCount`를 주문 수량만큼 증가시킵니다.
7. 전체 과정은 Prisma Transaction으로 처리됩니다.

**Error**

```json
{
  "statusCode": 400,
  "message": "존재하지 않는 밀키트가 포함되어 있습니다.",
  "error": "Bad Request"
}
```

---

#### **[GET] /orders/my 로그인한 회원의 주문 내역**

로그인한 회원 본인의 주문 내역을 조회합니다.

JWT 인증이 필요합니다.

**Headers**

| key | type | 필수여부 |
| --- | --- | --- |
| Authorization | String | O |

```text
Authorization: Bearer {accessToken}
```

**Params**

| key | type | 기본값 | 필수여부 | 설명 |
| --- | --- | --- | --- | --- |
| status | OrderStatus |  | X | 주문 상태 |

**OrderStatus**

```text
PENDING
PAID
SHIPPED
COMPLETED
CANCELED
```

**Request**

```text
GET /orders/my
```

또는

```text
GET /orders/my?status=PAID
```

**Response**

```json
[
  {
    "id": 101,
    "memberId": 6,
    "totalPrice": 24900,
    "status": "COMPLETED",
    "orderedAt": "2026-02-10T11:20:00.000Z",
    "orderItems": [
      {
        "id": 1,
        "orderId": 101,
        "mealkitId": 1,
        "quantity": 1,
        "unitPrice": 24900,
        "mealkit": {
          "id": 1,
          "chefId": 2,
          "name": "바삭촉촉 정통 수제 멘보샤 키트 (8pcs)",
          "recipe": "...",
          "description": "...",
          "price": 24900,
          "orderCount": 142,
          "createdAt": "2026-01-12T10:00:00.000Z",
          "updatedAt": "2026-01-12T10:00:00.000Z"
        }
      }
    ]
  }
]
```

**설명**

로그인한 회원의 `memberId`를 기준으로 주문을 조회합니다.

`status`를 전달하면 해당 상태의 주문만 조회합니다.

---

#### **[GET] /orders/chef 셰프가 만든 밀키트 주문 조회**

셰프가 자신이 등록한 밀키트가 포함된 주문을 조회합니다.

JWT 인증이 필요합니다.

CHEF 또는 ADMIN 권한이 필요합니다.

**Headers**

| key | type | 필수여부 |
| --- | --- | --- |
| Authorization | String | O |

```text
Authorization: Bearer {accessToken}
```

**Response**

```json
[
  {
    "id": 103,
    "memberId": 7,
    "totalPrice": 21900,
    "status": "PENDING",
    "orderedAt": "2026-02-20T09:15:00.000Z",
    "member": {
      "id": 7,
      "name": "요리탐험가",
      "email": "park@user.com",
      "address": "경기도 성남시 분당구 판교역로 100",
      "phone": "010-9999-0000",
      "role": "USER"
    },
    "orderItems": [
      {
        "id": 4,
        "orderId": 103,
        "mealkitId": 4,
        "quantity": 1,
        "unitPrice": 21900,
        "mealkit": {
          "id": 4,
          "chefId": 4,
          "name": "스타일리시셰프의 화이트와인 봉골레 생파스타",
          "price": 21900,
          "orderCount": 84
        }
      }
    ]
  }
]
```

**설명**

현재 로그인한 셰프의 `member.id`와 밀키트의 `chefId`가 일치하는 주문을 조회합니다.

즉, 다른 셰프가 만든 밀키트의 주문은 조회되지 않습니다.

ADMIN은 모든 셰프 주문을 조회할 수 있습니다.

**Error**

```json
{
  "statusCode": 403,
  "message": "주문 조회 권한이 없습니다",
  "error": "Forbidden"
}
```

---

#### **[GET] /orders/all 관리자 주문 조회**

관리자가 전체 주문을 조회합니다.

JWT 인증이 필요합니다.

ADMIN 권한이 필요합니다.

**Headers**

| key | type | 필수여부 |
| --- | --- | --- |
| Authorization | String | O |

```text
Authorization: Bearer {accessToken}
```

**Params**

| key | type | 기본값 | 필수여부 | 설명 |
| --- | --- | --- | --- | --- |
| status | OrderStatus |  | X | 주문 상태 |
| memberId | Int |  | X | 회원 ID |
| chefId | Int |  | X | 셰프 ID |
| mealkitId | Int |  | X | 밀키트 ID |
| startDate | String |  | X | 주문 시작일 |
| endDate | String |  | X | 주문 종료일 |
| orderByDate | asc / desc | desc | X | 주문일 정렬 |

**Request**

```text
GET /orders/all
```

또는

```text
GET /orders/all?status=PAID
```

```text
GET /orders/all?memberId=7
```

```text
GET /orders/all?status=PAID&memberId=7&orderByDate=asc
```

**Response**

```json
[
  {
    "id": 104,
    "memberId": 7,
    "totalPrice": 53000,
    "status": "PAID",
    "orderedAt": "2026-02-21T18:30:00.000Z",
    "member": {
      "id": 7,
      "name": "요리탐험가",
      "email": "park@user.com",
      "address": "경기도 성남시 분당구 판교역로 100",
      "phone": "010-9999-0000",
      "role": "USER"
    },
    "orderItems": [
      {
        "id": 5,
        "orderId": 104,
        "mealkitId": 5,
        "quantity": 2,
        "unitPrice": 26500,
        "mealkit": {
          "id": 5,
          "chefId": 5,
          "name": "딤섬마스터의 수제 딤섬 & 사천 흑초 마파두부",
          "price": 26500,
          "orderCount": 112
        }
      }
    ]
  }
]
```


**Error**

```json
{
  "statusCode": 403,
  "message": "주문 조회 권한이 없습니다.",
  "error": "Forbidden"
}
```

---

#### **[GET] /orders/all/:id 주문 상세 정보**

특정 주문의 상세 정보를 조회합니다.

JWT 인증이 필요합니다.

**Path Params**

| key | type | 필수여부 | 설명 |
| --- | --- | --- | --- |
| id | Int | O | 주문 ID |

**Request**

```text
GET /orders/all/101
```

**Response**

```json
{
  "id": 101,
  "memberId": 6,
  "totalPrice": 24900,
  "status": "COMPLETED",
  "orderedAt": "2026-02-10T11:20:00.000Z",
  "member": {
    "id": 6,
    "name": "한끼미식가",
    "email": "user@user.com",
    "address": "서울시 송파구 잠실로 77 101동 1202호",
    "phone": "010-7777-8888",
    "role": "USER"
  },
  "orderItems": [
    {
      "id": 1,
      "orderId": 101,
      "mealkitId": 1,
      "quantity": 1,
      "unitPrice": 24900,
      "mealkit": {
        "id": 1,
        "chefId": 2,
        "name": "바삭촉촉 정통 수제 멘보샤 키트 (8pcs)",
        "recipe": "...",
        "description": "...",
        "price": 24900,
        "orderCount": 142,
        "createdAt": "2026-01-12T10:00:00.000Z",
        "updatedAt": "2026-01-12T10:00:00.000Z"
      }
    }
  ]
}
```

**Error**

```json
{
  "statusCode": 404,
  "message": "주문번호 101를 찾을 수 없습니다",
  "error": "Not Found"
}
```

---

#### **[PATCH] /orders/all/:id/status 주문 상태 변경**

관리자가 특정 주문의 상태를 변경합니다.

JWT 인증이 필요합니다.

ADMIN 권한이 필요합니다.

**Headers**

| key | type | 필수여부 |
| --- | --- | --- |
| Authorization | String | O |

```text
Authorization: Bearer {accessToken}
```

**Path Params**

| key | type | 필수여부 | 설명 |
| --- | --- | --- | --- |
| id | Int | O | 주문 ID |

**Request Body**

| key | type | 필수여부 | 설명 |
| --- | --- | --- | --- |
| status | OrderStatus | O | 변경할 주문 상태 |

**OrderStatus**

```text
PENDING
PAID
SHIPPED
COMPLETED
CANCELED
```

**Request**

```text
PATCH /orders/all/105/status
```

```json
{
  "status": "PAID"
}
```

**Response**

```json
{
  "id": 105,
  "memberId": 6,
  "totalPrice": 23500,
  "status": "PAID",
  "orderedAt": "2026-02-23T04:10:00.000Z"
}
```

**설명**

관리자만 주문 상태를 변경할 수 있습니다.

현재 구현에서는 주문 상태만 변경할 수 있으며 주문 상품, 주문 금액 등의 정보는 변경하지 않습니다.

**Error**

```json
{
  "statusCode": 403,
  "message": "주문 수정 권한이 없습니다.",
  "error": "Forbidden"
}
```

---

### **Order Status**

| 상태 | 설명 |
| --- | --- |
| PENDING | 주문 대기 |
| PAID | 결제 완료 |
| SHIPPED | 배송 중 |
| COMPLETED | 주문 완료 |
| CANCELED | 주문 취소 |

---

### **Order 구조**

| key | type | 설명 |
| --- | --- | --- |
| id | Int | 주문 ID |
| memberId | Int | 주문한 회원 ID |
| totalPrice | Int | 주문 총 금액 |
| status | OrderStatus | 주문 상태 |
| orderedAt | DateTime | 주문일 |
| orderItems | Array | 주문 상품 목록 |

```json
{
  "id": 101,
  "memberId": 6,
  "totalPrice": 24900,
  "status": "COMPLETED",
  "orderedAt": "2026-02-10T11:20:00.000Z",
  "orderItems": [
    {
      "id": 1,
      "orderId": 101,
      "mealkitId": 1,
      "quantity": 1,
      "unitPrice": 24900
    }
  ]
}
```

---

### **OrderItem 구조**

| key | type | 설명 |
| --- | --- | --- |
| id | Int | 주문 상품 ID |
| orderId | Int | 주문 ID |
| mealkitId | Int | 밀키트 ID |
| quantity | Int | 주문 수량 |
| unitPrice | Int | 주문 당시 밀키트 단가 |

---

### **권한**

| API | USER | CHEF | ADMIN |
| --- | --- | --- | --- |
| POST /orders | O | O | O |
| GET /orders/my | O | O | O |
| GET /orders/chef | X | O | O |
| GET /orders/all | X | X | O |
| GET /orders/all/:id | JWT | JWT | JWT |
| PATCH /orders/all/:id/status | X | X | O |

---

### **API 요약**

| Method | Endpoint | 설명 | 권한 |
| --- | --- | --- | --- |
| POST | `/orders` | 밀키트 주문 | 로그인 회원 |
| GET | `/orders/my` | 내 주문 조회 | 로그인 회원 |
| GET | `/orders/chef` | 셰프가 만든 밀키트 주문 조회 | CHEF / ADMIN |
| GET | `/orders/all` | 전체 주문 조회 | ADMIN |
| GET | `/orders/all/:id` | 주문 상세 조회 | JWT |
| PATCH | `/orders/all/:id/status` | 주문 상태 변경 | ADMIN |

