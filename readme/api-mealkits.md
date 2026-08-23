# chefkit API

## mealkits

### [POST] /mealkits — 밀키트 등록

**권한:** ADMIN / CHEF  
**인증:** 필요 (`Bearer Token`)

#### Request

```json
{
  "name": "매콤 투움바 파스타",
  "recipe": "파스타면을 삶고 소스를 만든 뒤 재료와 함께 볶아 완성한다.",
  "description": "매콤하고 꾸덕한 크림 파스타",
  "mealkitIngredients": [
    {
      "ingredientId": 122,
      "quantity": 2
    },
    {
      "ingredientId": 138,
      "quantity": 1
    },
    {
      "ingredientId": 113,
      "quantity": 1
    }
  ]
}
```

#### Request Fields

| key | type | 필수 | 설명 |
|---|---|---|---|
| name | String | O | 밀키트 이름 (2~100자) |
| recipe | String | O | 조리법 (최소 2자) |
| description | String | O | 밀키트 설명 (2~255자) |
| mealkitIngredients | Array | O | 밀키트에 포함할 재료 목록 |
| mealkitIngredients[].ingredientId | Int | O | 재료 ID (1 이상) |
| mealkitIngredients[].quantity | Int | O | 재료 수량 (1 이상) |

#### Response

```json
{
  "id": 12,
  "chefId": 4,
  "name": "매콤 투움바 파스타",
  "recipe": "파스타면을 삶고 소스를 만든 뒤 재료와 함께 볶아 완성한다.",
  "description": "매콤하고 꾸덕한 크림 파스타",
  "price": 4000,
  "orderCount": 0,
  "createdAt": "2026-08-10T01:55:38.203Z",
  "updatedAt": "2026-08-10T01:55:38.203Z",
  "mealkitIngredients": [
    {
      "mealkitId": 12,
      "ingredientId": 122,
      "quantity": 2,
      "price": 1400,
      "ingredient": {
        "id": 122,
        "name": "파스타면",
        "location": "국내산",
        "unit": "G100",
        "unitPrice": 700,
        "createdAt": "2026-06-19T10:42:46.821Z",
        "updatedAt": "2026-06-19T10:42:46.821Z"
      }
    },
    {
      "mealkitId": 12,
      "ingredientId": 138,
      "quantity": 1,
      "price": 1100,
      "ingredient": {
        "id": 138,
        "name": "토마토소스",
        "location": "이탈리아",
        "unit": "G100",
        "unitPrice": 1100,
        "createdAt": "2026-06-19T10:42:46.821Z",
        "updatedAt": "2026-06-19T10:42:46.821Z"
      }
    }
  ]
}
```

#### Error

존재하지 않는 재료가 포함된 경우:

```json
{
  "message": "존재하지 않는 재료가 포함되어 있습니다",
  "error": "Bad Request",
  "statusCode": 400
}
```

권한이 없는 경우:

```json
{
  "message": "밀키트 등록 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

### [GET] /mealkits — 밀키트 목록 조회

**권한:** ADMIN / CHEF / USER  
**인증:** 불필요

#### Params

| key | type | 기본값 | 필수 | 설명 |
|---|---|---:|---|---|
| page | Int | 1 | X | 페이지 번호 |
| limit | Int | 10 | X | 페이지당 조회 개수 |
| sort | Enum | latest | X | 정렬 방식 |
| name | String | - | X | 이름 검색 |
| search | String | - | X | 이름/레시피/설명 통합 검색 |

#### sort

| 값 | 설명 |
|---|---|
| latest | 최근 수정순 |
| oldest | 오래된 수정순 |
| priceHigh | 가격 높은순 |
| priceLow | 가격 낮은순 |
| popular | 주문 횟수 높은순 |

> `latest`는 Service에서 별도 처리하지 않지만 기본값인 `updatedAt desc`와 동일하게 동작합니다.

#### Example

```http
GET /mealkits?page=1&limit=10&sort=popular&search=김치
```

#### Response

```json
{
  "items": [
    {
      "id": 6,
      "chefId": 6,
      "name": "차돌박이 된장찌개",
      "recipe": "차돌박이와 된장을 넣고 끓여 완성한다.",
      "description": "진하고 구수한 된장찌개",
      "price": 5600,
      "orderCount": 7,
      "createdAt": "2026-06-19T05:24:24.637Z",
      "updatedAt": "2026-06-21T08:09:54.749Z"
    },
    {
      "id": 3,
      "chefId": 3,
      "name": "김치찌개",
      "recipe": "돼지고기와 김치를 볶은 후 육수를 넣고 끓인다.",
      "description": "깊은 맛의 김치찌개",
      "price": 38600,
      "orderCount": 4,
      "createdAt": "2026-06-19T05:12:46.687Z",
      "updatedAt": "2026-06-21T08:09:54.749Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### [GET] /mealkits/chef — 내가 등록한 밀키트 목록 조회

**권한:** 로그인한 CHEF  
**인증:** 필요 (`Bearer Token`)

> 현재 Controller와 Service에 별도로 구현되어 있는 API입니다.

#### Params

| key | type | 기본값 | 필수 | 설명 |
|---|---|---:|---|---|
| page | Int | 1 | X | 페이지 번호 |
| limit | Int | 10 | X | 페이지당 조회 개수 |
| sort | Enum | latest | X | 정렬 방식 |
| name | String | - | X | 밀키트 이름 검색 |
| search | String | - | X | 이름/레시피/설명 통합 검색 |

#### Example

```http
GET /mealkits/chef?page=1&limit=10&sort=latest&name=김치
```

#### Response

```json
{
  "items": [
    {
      "id": 3,
      "chefId": 3,
      "name": "김치찌개",
      "recipe": "돼지고기와 김치를 볶은 후 육수를 넣고 끓인다.",
      "description": "깊고 진한 맛의 김치찌개",
      "price": 38600,
      "orderCount": 4,
      "createdAt": "2026-06-19T05:12:46.687Z",
      "updatedAt": "2026-06-21T08:09:54.749Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### [GET] /mealkits/:id — 밀키트 상세 조회

**권한:** ADMIN / CHEF / USER  
**인증:** 불필요

#### Path Parameter

| key | type | 필수 | 설명 |
|---|---|---|---|
| id | Int | O | 밀키트 ID |

#### Example

```http
GET /mealkits/6
```

#### Response

```json
{
  "id": 6,
  "chefId": 6,
  "name": "차돌박이 된장찌개",
  "recipe": "차돌박이와 된장을 넣고 끓여 완성한다.",
  "description": "진하고 구수한 된장찌개",
  "price": 5600,
  "orderCount": 7,
  "createdAt": "2026-06-19T05:24:24.637Z",
  "updatedAt": "2026-06-21T08:09:54.749Z",
  "chef": {
    "id": 6,
    "name": "최강셰프",
    "email": "bestchef@chef.com"
  },
  "mealkitIngredients": [
    {
      "mealkitId": 6,
      "ingredientId": 155,
      "quantity": 1,
      "price": 2800,
      "ingredient": {
        "id": 155,
        "name": "국물용 멸치",
        "location": "통영",
        "unit": "G100",
        "unitPrice": 2800,
        "createdAt": "2026-06-19T10:45:42.326Z",
        "updatedAt": "2026-06-19T10:45:42.326Z"
      }
    },
    {
      "mealkitId": 6,
      "ingredientId": 106,
      "quantity": 1,
      "price": 1600,
      "ingredient": {
        "id": 106,
        "name": "된장",
        "location": "괴산",
        "unit": "G100",
        "unitPrice": 1600,
        "createdAt": "2026-06-19T10:42:46.821Z",
        "updatedAt": "2026-06-19T10:42:46.821Z"
      }
    }
  ]
}
```

#### Error

```json
{
  "message": "밀키트 999를 찾을 수 없습니다",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### [PATCH] /mealkits/:id — 밀키트 정보 수정

**권한:** ADMIN / 해당 밀키트를 등록한 CHEF  
**인증:** 필요 (`Bearer Token`)

#### Path Parameter

| key | type | 필수 | 설명 |
|---|---|---|---|
| id | Int | O | 수정할 밀키트 ID |

#### Request

```json
{
  "name": "김치찌개"
}
```

재료까지 수정하는 경우:

```json
{
  "name": "김치찌개",
  "recipe": "돼지고기와 김치를 볶은 후 육수를 넣고 끓인다.",
  "description": "깊고 진한 맛의 김치찌개",
  "mealkitIngredients": [
    {
      "ingredientId": 10,
      "quantity": 2
    },
    {
      "ingredientId": 20,
      "quantity": 1
    }
  ]
}
```

#### Request Fields

| key | type | 필수 | 설명 |
|---|---|---|---|
| name | String | X | 밀키트 이름 |
| recipe | String | X | 조리법 |
| description | String | X | 밀키트 설명 |
| mealkitIngredients | Array | X | 재료 목록 전체 교체 |
| mealkitIngredients[].ingredientId | Int | 조건부 | 재료 ID |
| mealkitIngredients[].quantity | Int | 조건부 | 재료 수량 |

> `mealkitIngredients`를 전달하지 않으면 기존 재료는 유지됩니다.
>
> `mealkitIngredients`를 전달하면 기존 재료 목록을 삭제하고 전달받은 재료 목록으로 교체합니다.
>
> 재료가 변경되면 재료의 현재 `unitPrice`를 기준으로 밀키트 가격을 다시 계산합니다.

#### Response

```json
{
  "id": 3,
  "chefId": 3,
  "name": "김치찌개",
  "recipe": "돼지고기와 김치를 볶은 후 육수를 넣고 끓인다.",
  "description": "깊고 진한 맛의 김치찌개",
  "price": 38600,
  "orderCount": 4,
  "createdAt": "2026-06-19T05:12:46.687Z",
  "updatedAt": "2026-08-10T01:59:27.833Z"
}
```

#### Error

권한이 없는 경우:

```json
{
  "message": "밀키트 수정 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

존재하지 않는 재료가 포함된 경우:

```json
{
  "message": "존재하지 않는 재료가 포함되어 있습니다",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### [DELETE] /mealkits/:id — 밀키트 삭제

**권한:** ADMIN  
**인증:** 필요 (`Bearer Token`)

#### Path Parameter

| key | type | 필수 | 설명 |
|---|---|---|---|
| id | Int | O | 삭제할 밀키트 ID |

#### Response

```json
{
  "deleted": 9
}
```

#### 삭제 제한

주문 내역이 있는 밀키트는 삭제할 수 없습니다.

```json
{
  "message": "주문내역이 있는 밀키트는 삭제할 수 없습니다",
  "error": "Bad Request",
  "statusCode": 400
}
```

관리자가 아닌 경우:

```json
{
  "message": "밀키트 삭제 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

# API 권한 정리

| Method | Endpoint | ADMIN | CHEF | USER | 인증 |
|---|---|:---:|:---:|:---:|:---:|
| POST | `/mealkits` | O | O | X | 필요 |
| GET | `/mealkits` | O | O | O | 불필요 |
| GET | `/mealkits/chef` | O* | O | X | 필요 |
| GET | `/mealkits/:id` | O | O | O | 불필요 |
| PATCH | `/mealkits/:id` | O | O** | X | 필요 |
| DELETE | `/mealkits/:id` | O | X | X | 필요 |

> `GET /mealkits/chef`는 현재 로그인한 사용자의 `id`를 `chefId`로 사용하여 해당 셰프가 등록한 밀키트를 조회합니다.
>
> `PATCH /mealkits/:id`는 ADMIN의 경우 모든 밀키트를 수정할 수 있으며, CHEF는 자신이 등록한 밀키트만 수정할 수 있습니다.

---

# DTO

## CreateMealkitDto

```typescript
class CreateMealkitIngredientDto {
  ingredientId: number;
  quantity: number;
}

export class CreateMealkitDto {
  name: string;
  recipe: string;
  description: string;
  mealkitIngredients: CreateMealkitIngredientDto[];
}
```

### Validation

| 필드 | Validation |
|---|---|
| name | String, 최소 2자, 최대 100자 |
| recipe | String, 최소 2자 |
| description | String, 최소 2자, 최대 255자 |
| mealkitIngredients | Array |
| ingredientId | Integer, 최소 1 |
| quantity | Integer, 최소 1 |

---

## SearchMealkitDto

```typescript
export class SearchMealkitDto extends PageRequestDto {
  sort?: string;
  name?: string;
  search?: string;
}
```

### Validation

| 필드 | Validation |
|---|---|
| page | 기본값 1 |
| limit | 기본값 10 |
| sort | latest, oldest, priceHigh, priceLow, popular |
| name | String |
| search | String |

---

# 가격 계산

밀키트 등록 시 각 재료의 `unitPrice`와 요청한 `quantity`를 곱하여 밀키트 가격을 계산합니다.

```text
재료 가격 = unitPrice × quantity

밀키트 가격 = 모든 재료 가격의 합
```

예시:

```text
파스타면     700 × 2 = 1,400원
토마토소스  1,100 × 1 = 1,100원
고춧가루    1,500 × 1 = 1,500원
--------------------------------
총 가격                  4,000원
```

따라서 생성된 밀키트의 `price`는 `4000`이 됩니다.

---

# 재료 가격 변경 시

재료의 가격이 변경되면 해당 재료를 사용하는 밀키트의 가격도 다시 계산됩니다.

```text
재료 unitPrice 변경
        ↓
해당 재료를 사용하는 밀키트 조회
        ↓
밀키트 재료 가격 재계산
        ↓
밀키트 총 가격 재계산
```

---

# 주요 예외

## 400 Bad Request

### 존재하지 않는 재료

```json
{
  "message": "존재하지 않는 재료가 포함되어 있습니다",
  "error": "Bad Request",
  "statusCode": 400
}
```

### 주문 내역이 있는 밀키트 삭제

```json
{
  "message": "주문내역이 있는 밀키트는 삭제할 수 없습니다",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 403 Forbidden

### 밀키트 등록 권한 없음

```json
{
  "message": "밀키트 등록 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 밀키트 수정 권한 없음

```json
{
  "message": "밀키트 수정 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 밀키트 삭제 권한 없음

```json
{
  "message": "밀키트 삭제 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

## 404 Not Found

### 존재하지 않는 밀키트

```json
{
  "message": "밀키트 999를 찾을 수 없습니다",
  "error": "Not Found",
  "statusCode": 404
}
```