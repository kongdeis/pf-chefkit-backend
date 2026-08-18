# chefkit API


### <span style="color: red;">**mealkits**</span>

#### **[POST]** /mealkits 밀키트 등록 (ADMIN/CHEF)
**Request**
```json
{
  "name": "매콤 투움바 파스타",
  "recipe": "1. 파스타면을 삶는다. 2. 생크림에 진간장, 고춧가루를 섞어 소스를 만든다. 3. 올리브유에 새우, 양파, 마늘을 볶다가 소스와 면을 넣어 졸인다.",
  "description": "아웃백 부럽지 않은 매콤하고 꾸덕한 크림 파스타",
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
**Response**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "id": 12,
        "chefId": 4,
        "name": "매콤 투움바 파스타",
        "recipe": "1. 파스타면을 삶는다. 2. 생크림에 진간장, 고춧가루를 섞어 소스를 만든다. 3. 올리브유에 새우, 양파, 마늘을 볶다가 소스와 면을 넣어 졸인다.",
        "description": "아웃백 부럽지 않은 매콤하고 꾸덕한 크림 파스타",
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
            },
            {
                "mealkitId": 12,
                "ingredientId": 113,
                "quantity": 1,
                "price": 1500,
                "ingredient": {
                    "id": 113,
                    "name": "고춧가루",
                    "location": "중국",
                    "unit": "G100",
                    "unitPrice": 1500,
                    "createdAt": "2026-06-19T10:42:46.821Z",
                    "updatedAt": "2026-06-19T10:42:46.821Z"
                }
            }
        ]
    }
}
```
<br/>

#### **[GET]** /mealkits/ 밀키트 목록 조회 (ADMIN/CHEF/USER)
**Params**
| key    | type   | 기본값 | 필수여부 |
| ------ | ------ | ------ | -------- |
| sort   | Enum   |        |
| name   | String |        |
| search | String |        |

sort: latest, oldest, priceHigh, priceLow, popular

**Response**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "items": [
            {
                "id": 6,
                "chefId": 6,
                "name": "차돌박이 된장찌개",
                "recipe": "1. 차돌박이를 구워 기름을 낸다. 2. 된장을 풀고 무, 두부를 넣는다. 3. 대파와 청양고추를 넣어 칼칼하게 끓인다.",
                "description": "고깃집에서 먹던 바로 그 진하고 구수한 된장찌개",
                "price": 5600,
                "orderCount": 7,
                "createdAt": "2026-06-19T05:24:24.637Z",
                "updatedAt": "2026-06-21T08:09:54.749Z"
            },
            {
                "id": 3,
                "chefId": 3,
                "name": "김치찌개",
                "recipe": "1. 돼지고기를 참기름에 볶는다. 2. 신김치와 양파를 넣고 함께 볶는다. 3. 육수를 붓고 대파와 마늘을 넣어 푹 끓인다.",
                "description": "깊은 맛의 육수와 묵은지가 어우러진 밥도둑 김치찌개",
                "price": 38600,
                "orderCount": 4,
                "createdAt": "2026-06-19T05:12:46.687Z",
                "updatedAt": "2026-06-21T08:09:54.749Z"
            },
            {
                "id": 4,
                "chefId": 3,
                "name": "매콤 달콤 돼지갈비찜",
                "recipe": "1. 갈비를 핏물을 빼고 데친다. 2. 간장 양념장과 감자, 당근을 넣는다. 3. 마늘과 대파를 넣고 약불로 졸인다",
                "description": "명절에 먹던 그 부드럽고 매운 갈비찜 맛 그대로",
                "price": 15600,
                "orderCount": 2,
                "createdAt": "2026-06-19T05:18:26.132Z",
                "updatedAt": "2026-06-21T08:02:02.474Z"
            },
            {
                "id": 8,
                "chefId": 6,
                "name": "진한 소고기 미역국",
                "recipe": "1. 참기름에 소고기 국거리를 달달 볶는다. 2. 불린 미역을 넣고 함께 볶다 육수를 붓는다. 3. 다진마늘과 국간장으로 간한다.",
                "description": "어머니가 끓여주시던 깊고 진한 미역국",
                "price": 10000,
                "orderCount": 1,
                "createdAt": "2026-06-19T05:28:06.725Z",
                "updatedAt": "2026-06-21T08:01:40.546Z"
            },
            {
                "id": 12,
                "chefId": 4,
                "name": "매콤 투움바 파스타",
                "recipe": "1. 파스타면을 삶는다. 2. 생크림에 진간장, 고춧가루를 섞어 소스를 만든다. 3. 올리브유에 새우, 양파, 마늘을 볶다가 소스와 면을 넣어 졸인다.",
                "description": "아웃백 부럽지 않은 매콤하고 꾸덕한 크림 파스타",
                "price": 4000,
                "orderCount": 0,
                "createdAt": "2026-08-10T01:55:38.203Z",
                "updatedAt": "2026-08-10T01:55:38.203Z"
            },
            {
                "id": 9,
                "chefId": 3,
                "name": "정통 이탈리안 까르보나라",
                "recipe": "1. 파스타면을 소금물에 삶는다. 2. 팬에 올리브유를 두르고 돼지 목살(혹은 베컨)과 마늘을 볶는다. 3. 불을 끄고 면, 계란 노른자, 파르메산 치즈가루를 재빨리 섞는다.",
                "description": "크림 없이 계란 노른자와 치즈로만 맛을 낸 정통 로마식 까르보나라",
                "price": 10500,
                "orderCount": 0,
                "createdAt": "2026-06-21T01:49:01.732Z",
                "updatedAt": "2026-06-21T01:49:01.732Z"
            },
            {
                "id": 11,
                "chefId": 4,
                "name": "전복 버터구이",
                "recipe": "1. 전복을 손질한다. 2. 버터를 녹인 팬에 전복을 굽는다. 3. 마늘을 넣고 향을 입혀 완성한다.",
                "description": "고급 일식집 스타일 전복 버터구이",
                "price": 27700,
                "orderCount": 0,
                "createdAt": "2026-06-22T02:15:09.634Z",
                "updatedAt": "2026-06-22T02:15:09.634Z"
            },
            {
                "id": 7,
                "chefId": 6,
                "name": "뚝배기 소불고기",
                "recipe": "1. 소고기를 간장, 설탕 양념에 재운다. 2. 양파, 팽이버섯, 대파를 썰어 넣는다. 3. 자작하게 국물을 남겨 끓인다.",
                "description": "단짠단짠의 정석, 남녀노소 좋아하는 불고기",
                "price": 43550,
                "orderCount": 0,
                "createdAt": "2026-06-19T05:26:26.830Z",
                "updatedAt": "2026-06-20T09:13:36.064Z"
            }
        ],
        "total": 8,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}
```
<br/>

#### **[GET]** /mealkits/:id 밀키트 id 조회
**Reponse**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "id": 6,
        "chefId": 6,
        "name": "차돌박이 된장찌개",
        "recipe": "1. 차돌박이를 구워 기름을 낸다. 2. 된장을 풀고 무, 두부를 넣는다. 3. 대파와 청양고추를 넣어 칼칼하게 끓인다.",
        "description": "고깃집에서 먹던 바로 그 진하고 구수한 된장찌개",
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
            },
            {
                "mealkitId": 6,
                "ingredientId": 98,
                "quantity": 1,
                "price": 1200,
                "ingredient": {
                    "id": 98,
                    "name": "두부",
                    "location": "미국",
                    "unit": "EA",
                    "unitPrice": 1200,
                    "createdAt": "2026-06-19T10:39:39.436Z",
                    "updatedAt": "2026-06-19T10:39:39.436Z"
                }
            }
        ]
    }
}
```
<br/>

#### **[PATCH]** /mealkits/:id 밀키트 id 정보 수정
**Request**
```json
{
    "name": "김치찌개"
}
```
**Reponse**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "id": 3,
        "chefId": 3,
        "name": "김치찌개",
        "recipe": "1. 돼지고기를 참기름에 볶는다. 2. 신김치와 양파를 넣고 함께 볶는다. 3. 육수를 붓고 대파와 마늘을 넣어 푹 끓인다.",
        "description": "깊은 맛의 육수와 묵은지가 어우러진 밥도둑 김치찌개",
        "price": 38600,
        "orderCount": 4,
        "createdAt": "2026-06-19T05:12:46.687Z",
        "updatedAt": "2026-08-10T01:59:27.833Z"
    }
}
```
<br/>

#### **[DELETE]** /mealkits/:id 밀키트 삭제
**Reponse**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "deleted": 9
    }
}
```
<br/>