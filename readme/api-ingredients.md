# chefkit API

### <span style="color: red;">**ingredients**</span>

---

#### **[POST] /ingredients 재료 등록 (ADMIN)**

관리자만 새로운 재료를 등록할 수 있습니다.

재료의 `name`과 `location` 조합이 이미 존재하는 경우 등록할 수 없습니다.

### Authorization

```http
Authorization: Bearer {access_token}
```

### Request

```json
{
  "name": "대파",
  "location": "강원도",
  "unit": "EA",
  "unitPrice": 1000
}
```

### Request Params

| key | type | 기본값 | 필수여부 | 설명 |
|---|---|---|---|---|
| name | String | - | 필수 | 재료명, 최소 2자 / 최대 50자 |
| location | String | - | 필수 | 재료 보관 위치 또는 원산지, 최소 2자 / 최대 50자 |
| unit | Enum | - | 필수 | `EA`, `G1`, `G10`, `G100`, `KG1` |
| unitPrice | Int | - | 필수 | 재료 단가, 0 이상 |

### Unit Enum

| 값 | 설명 |
|---|---|
| EA | 개 |
| G1 | 1g |
| G10 | 10g |
| G100 | 100g |
| KG1 | 1kg |

### Response

```json
{
  "id": 205,
  "name": "대파",
  "location": "강원도",
  "unit": "EA",
  "unitPrice": 1000,
  "createdAt": "2026-08-10T01:46:34.396Z",
  "updatedAt": "2026-08-10T01:46:34.396Z"
}
```

### 등록 실패 - 권한 없음

관리자가 아닌 회원이 요청하면 `403 Forbidden`이 발생합니다.

```json
{
  "message": "재료 등록 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 등록 실패 - 중복 재료

동일한 `name`과 `location`을 가진 재료가 이미 등록되어 있으면 `409 Conflict`가 발생합니다.

```json
{
  "message": "이미 등록된 재료입니다",
  "error": "Conflict",
  "statusCode": 409
}
```

### 등록 실패 - 잘못된 입력

DTO의 유효성 검사 조건을 만족하지 않으면 `400 Bad Request`가 발생합니다.

예를 들어 `unit`에 존재하지 않는 값을 입력한 경우:

```json
{
  "message": [
    "unit must be one of the following values: EA, G1, G10, G100, KG1"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

#### **[GET] /ingredients 재료 검색 (ADMIN / CHEF)**

관리자와 셰프가 등록된 재료를 조회할 수 있습니다.

페이지네이션, 재료명 검색, 위치 검색 및 정렬 기능을 제공합니다.

### Authorization

```http
Authorization: Bearer {access_token}
```

### Params

| key | type | 기본값 | 필수여부 | 설명 |
|---|---|---|---|---|
| page | Int | 1 | 선택 | 조회할 페이지 |
| limit | Int | 10 | 선택 | 한 페이지에 표시할 데이터 수 |
| sort | Enum | `updateLatest` | 선택 | 정렬 기준 |
| name | String | - | 선택 | 재료명 검색 |
| location | String | - | 선택 | 위치 검색 |

### sort

| 값 | 설명 |
|---|---|
| createOldest | 등록일 오래된 순 |
| updateOldest | 수정일 오래된 순 |
| createLatest | 등록일 최신 순 |
| updateLatest | 수정일 최신 순 |
| priceHigh | 가격 높은 순 |
| priceLow | 가격 낮은 순 |

`sort`를 입력하지 않으면 기본적으로 `updatedAt desc`, 즉 **수정일 최신 순**으로 조회됩니다.

### 검색

`name`과 `location`은 부분 검색을 지원합니다.

예:

```http
GET /ingredients?name=꽃게
```

```http
GET /ingredients?location=제주
```

```http
GET /ingredients?name=꽃게&location=제주
```

검색은 대소문자를 구분하지 않는 방식으로 처리됩니다.

### 페이지네이션 예시

```http
GET /ingredients?page=1&limit=10&sort=priceHigh
```

### Response

```json
{
  "items": [
    {
      "id": 91,
      "name": "꽃게",
      "location": "연평도",
      "unit": "KG1",
      "unitPrice": 28000,
      "createdAt": "2026-06-19T10:39:39.436Z",
      "updatedAt": "2026-06-19T10:39:39.436Z"
    },
    {
      "id": 92,
      "name": "꽃게",
      "location": "서천",
      "unit": "KG1",
      "unitPrice": 25000,
      "createdAt": "2026-06-19T10:39:39.436Z",
      "updatedAt": "2026-06-19T10:39:39.436Z"
    },
    {
      "id": 93,
      "name": "꽃게",
      "location": "중국",
      "unit": "KG1",
      "unitPrice": 14000,
      "createdAt": "2026-06-19T10:39:39.436Z",
      "updatedAt": "2026-06-19T10:39:39.436Z"
    }
  ],
  "total": 201,
  "page": 1,
  "limit": 10,
  "totalPages": 21
}
```

### Response Params

| key | type | 설명 |
|---|---|---|
| items | Array | 조회된 재료 목록 |
| total | Int | 전체 재료 개수 |
| page | Int | 현재 페이지 |
| limit | Int | 페이지당 데이터 수 |
| totalPages | Int | 전체 페이지 수 |

각 재료 데이터:

| key | type | 설명 |
|---|---|---|
| id | Int | 재료 ID |
| name | String | 재료명 |
| location | String | 위치 또는 원산지 |
| unit | Enum | 단위 |
| unitPrice | Int | 단가 |
| createdAt | DateTime | 등록일 |
| updatedAt | DateTime | 수정일 |

### 권한 없음

USER가 재료 목록을 조회하려고 하면 `403 Forbidden`이 발생합니다.

```json
{
  "message": "재료 열람 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

#### **[GET] /ingredients/:id 재료 상세 조회 (ADMIN / CHEF)**

재료 ID를 이용하여 특정 재료의 상세 정보를 조회합니다.

관리자와 셰프만 조회할 수 있습니다.

### Authorization

```http
Authorization: Bearer {access_token}
```

### Request

```http
GET /ingredients/100
```

### Path Params

| key | type | 필수여부 | 설명 |
|---|---|---|---|
| id | Int | 필수 | 조회할 재료 ID |

### Response

```json
{
  "id": 100,
  "name": "계란",
  "location": "포천",
  "unit": "EA",
  "unitPrice": 300,
  "createdAt": "2026-06-19T10:39:39.436Z",
  "updatedAt": "2026-06-19T10:39:39.436Z"
}
```

### 재료를 찾을 수 없는 경우

존재하지 않는 ID를 요청하면 `404 Not Found`가 발생합니다.

```json
{
  "message": "재료 아이디 999 찾을 수 없습니다",
  "error": "Not Found",
  "statusCode": 404
}
```

---

#### **[PATCH] /ingredients/:id 재료 수정 (ADMIN)**

관리자만 재료 정보를 수정할 수 있습니다.

`name`, `location`, `unit`, `unitPrice`를 수정할 수 있습니다.

수정할 필드만 전달하면 됩니다.

### Authorization

```http
Authorization: Bearer {access_token}
```

### Request

```http
PATCH /ingredients/7
Content-Type: application/json
```

```json
{
  "unit": "G100",
  "unitPrice": 4200
}
```

### Request Params

| key | type | 필수여부 | 설명 |
|---|---|---|---|
| name | String | 선택 | 재료명, 최소 2자 / 최대 50자 |
| location | String | 선택 | 위치, 최소 2자 / 최대 50자 |
| unit | Enum | 선택 | `EA`, `G1`, `G10`, `G100`, `KG1` |
| unitPrice | Int | 선택 | 단가, 0 이상 |

### 수정 예시 1 - 단가만 수정

```json
{
  "unitPrice": 4200
}
```

### 수정 예시 2 - 단위와 단가 수정

```json
{
  "unit": "G100",
  "unitPrice": 4200
}
```

### 수정 예시 3 - 이름과 위치 수정

```json
{
  "name": "국내산 대파",
  "location": "강원도"
}
```

### Response

```json
{
  "id": 7,
  "name": "양파",
  "location": "중국",
  "unit": "G100",
  "unitPrice": 4200,
  "createdAt": "2026-06-19T10:37:11.814Z",
  "updatedAt": "2026-08-10T01:52:40.061Z"
}
```

### 중요 - 재료 가격 변경 시 밀키트 가격 반영

재료의 `unitPrice`가 변경되면 해당 재료를 사용하고 있는 모든 밀키트의 가격이 함께 다시 계산됩니다.

예를 들어 기존 재료 가격이:

```text
한우 안심 = 16,500원
```

에서

```text
한우 안심 = 18,000원
```

으로 변경되었다면,

해당 재료를 사용하는 밀키트의 `MealkitIngredient.price`가 변경되고 최종적으로 `Mealkit.price`도 다시 계산됩니다.

밀키트 가격은 다음 방식으로 계산됩니다.

```text
밀키트 가격
= 사용 재료별 단가 × 수량의 합계
```

예:

```text
한우 안심
18,000 × 2 = 36,000

트러플 오일
3,500 × 1 = 3,500

생 파스타면
1,800 × 2 = 3,600

--------------------------------
밀키트 가격 = 43,100원
```

따라서 재료 가격을 수정하면 해당 재료를 사용하는 밀키트의 가격도 자동으로 변경됩니다.

### 중복 재료

`name` 또는 `location`을 수정하면서 이미 존재하는 동일한 `name + location` 조합이 만들어지는 경우 수정할 수 없습니다.

```json
{
  "message": "이미 등록된 재료입니다.",
  "error": "Conflict",
  "statusCode": 409
}
```

### 재료 없음

존재하지 않는 재료를 수정하려고 하면 `404 Not Found`가 발생합니다.

```json
{
  "message": "재료를 찾을 수 없습니다.",
  "error": "Not Found",
  "statusCode": 404
}
```

### 권한 없음

관리자가 아닌 회원이 수정하려고 하면 `403 Forbidden`이 발생합니다.

```json
{
  "message": "재료 수정 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

#### **[DELETE] /ingredients/:id 재료 삭제 (ADMIN)**

관리자만 재료를 삭제할 수 있습니다.

단, 현재 등록된 밀키트에서 사용 중인 재료는 삭제할 수 없습니다.

### Authorization

```http
Authorization: Bearer {access_token}
```

### Request

```http
DELETE /ingredients/70
```

### Path Params

| key | type | 필수여부 | 설명 |
|---|---|---|---|
| id | Int | 필수 | 삭제할 재료 ID |

### Response

삭제 성공 시 삭제된 재료의 ID를 반환합니다.

```json
{
  "deleted": 70
}
```

### 삭제 실패 - 사용 중인 재료

해당 재료를 사용하고 있는 밀키트가 하나라도 존재하면 삭제할 수 없습니다.

```json
{
  "message": "이 재료를 사용하는 밀키트가 있어 삭제할 수 없습니다",
  "mealkitIds": [
    1,
    3,
    5
  ]
}
```

`mealkitIds`에는 해당 재료를 사용하고 있는 밀키트 ID가 포함됩니다.

### 삭제 실패 - 재료 없음

존재하지 않는 재료를 삭제하려고 하면 `404 Not Found`가 발생합니다.

```json
{
  "message": "재료 아이디 999 찾을 수 없습니다",
  "error": "Not Found",
  "statusCode": 404
}
```

### 삭제 실패 - 권한 없음

관리자가 아닌 회원이 삭제하려고 하면 `403 Forbidden`이 발생합니다.

```json
{
  "message": "재료 삭제 권한이 없습니다.",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

## API 권한 정리

| API | USER | CHEF | ADMIN |
|---|---:|---:|---:|
| POST /ingredients | ❌ | ❌ | ✅ |
| GET /ingredients | ❌ | ✅ | ✅ |
| GET /ingredients/:id | ❌ | ✅ | ✅ |
| PATCH /ingredients/:id | ❌ | ❌ | ✅ |
| DELETE /ingredients/:id | ❌ | ❌ | ✅ |

---

## Ingredient 데이터 구조

```json
{
  "id": 1,
  "name": "국내산 한우 1++ 안심",
  "location": "강원 횡성 / 냉장 A-1",
  "unit": "G100",
  "unitPrice": 16500,
  "createdAt": "2026-01-05T09:00:00.000Z",
  "updatedAt": "2026-01-05T09:00:00.000Z"
}
```

| key | type | 설명 |
|---|---|---|
| id | Int | 재료 고유 ID |
| name | String | 재료명 |
| location | String | 재료 위치 또는 원산지 |
| unit | Enum | 재료 단위 |
| unitPrice | Int | 재료 단가 |
| createdAt | DateTime | 등록일 |
| updatedAt | DateTime | 마지막 수정일 |

---

## Unit Enum

```text
EA
G1
G10
G100
KG1
```

| 값 | 의미 |
|---|---|
| EA | 개 |
| G1 | 1g |
| G10 | 10g |
| G100 | 100g |
| KG1 | 1kg |

---

## 검색 및 정렬 예시

### 전체 재료 최신 수정순 조회

```http
GET /ingredients
```

### 2페이지 조회

```http
GET /ingredients?page=2&limit=10
```

### 재료명 검색

```http
GET /ingredients?name=꽃게
```

### 위치 검색

```http
GET /ingredients?location=제주
```

### 재료명 + 위치 검색

```http
GET /ingredients?name=꽃게&location=제주
```

### 가격 높은 순

```http
GET /ingredients?sort=priceHigh
```

### 가격 낮은 순

```http
GET /ingredients?sort=priceLow
```

### 등록일 오래된 순

```http
GET /ingredients?sort=createOldest
```

### 등록일 최신 순

```http
GET /ingredients?sort=createLatest
```

### 수정일 오래된 순

```http
GET /ingredients?sort=updateOldest
```

### 수정일 최신 순

```http
GET /ingredients?sort=updateLatest
```

---

## 공통 인증 방식

모든 `ingredients` API는 JWT 인증이 필요합니다.

로그인 후 발급받은 Access Token을 Header에 포함해야 합니다.

```http
Authorization: Bearer {access_token}
```

예:

```http
GET /ingredients
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

권한에 맞지 않는 요청은 `403 Forbidden`으로 처리됩니다.