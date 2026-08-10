# chefkit API


### <span style="color: red;">**ingredients**</span>

#### **[GET]** /ingredients 재료 등록 (ADMIN)
**Params**
| key       | type    | 기본값 | 필수여부 |
| --------- | ------- | ------ | -------- |
| role      | [admin] |        |
| name      | String  |        |
| location  | String  |        |
| unit      | Enum    |        |
| unitPrice | Int     |        |

**Request**
```json
{
  "name": "대파",
  "location": "강원도",
  "unit": "EA",
  "unitPrice": 1000
}
```
**Response**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "id": 205,
        "name": "감자",
        "location": "강원도",
        "unit": "EA",
        "unitPrice": 1000,
        "createdAt": "2026-08-10T01:46:34.396Z",
        "updatedAt": "2026-08-10T01:46:34.396Z"
    }
}
```
<br/>


#### **[GET]** /ingredients 재료검색 (ADMIN/CHEF)
**Params**
| key   | type   | 기본값 | 필수여부 |
| ----- | ------ | ------ | -------- |
| page  | Int    | 1      |
| limit | Int    | 10     |
| sort  | Enum   |        |
| name  | String |        |

sort: createOldest, updateOldest, createLatest, updateLatest, priceHigh, priceLow

**Response**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
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
            },
            {
                "id": 85,
                "name": "갈치",
                "location": "제주",
                "unit": "EA",
                "unitPrice": 12000,
                "createdAt": "2026-06-19T10:39:39.436Z",
                "updatedAt": "2026-06-19T10:39:39.436Z"
            },
            {
                "id": 52,
                "name": "소고기 등심",
                "location": "횡성",
                "unit": "G100",
                "unitPrice": 12000,
                "createdAt": "2026-06-19T10:39:39.436Z",
                "updatedAt": "2026-06-19T10:39:39.436Z"
            },
            {
                "id": 86,
                "name": "갈치",
                "location": "목포",
                "unit": "EA",
                "unitPrice": 9000,
                "createdAt": "2026-06-19T10:39:39.436Z",
                "updatedAt": "2026-06-19T10:39:39.436Z"
            },
            {
                "id": 67,
                "name": "닭고기 볶음탕용",
                "location": "나주",
                "unit": "KG1",
                "unitPrice": 8900,
                "createdAt": "2026-06-19T10:39:39.436Z",
                "updatedAt": "2026-06-19T10:39:39.436Z"
            },
            {
                "id": 10,
                "name": "깐마늘",
                "location": "C식자재마트",
                "unit": "KG1",
                "unitPrice": 8500,
                "createdAt": "2026-06-19T10:37:11.814Z",
                "updatedAt": "2026-06-19T10:37:11.814Z"
            },
            {
                "id": 68,
                "name": "닭고기 볶음탕용",
                "location": "국내산",
                "unit": "KG1",
                "unitPrice": 7900,
                "createdAt": "2026-06-19T10:39:39.436Z",
                "updatedAt": "2026-06-19T10:39:39.436Z"
            },
            {
                "id": 55,
                "name": "소고기 국거리",
                "location": "평창",
                "unit": "G100",
                "unitPrice": 6500,
                "createdAt": "2026-06-19T10:39:39.436Z",
                "updatedAt": "2026-06-19T10:39:39.436Z"
            }
        ],
        "total": 201,
        "page": 1,
        "limit": 10,
        "totalPages": 21
    }
}
```
<br/>

#### **[GET]** /ingredients/:id 재료id검색 (ADMIN/CHEF)
**Response**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "id": 100,
        "name": "계란",
        "location": "포천",
        "unit": "EA",
        "unitPrice": 300,
        "createdAt": "2026-06-19T10:39:39.436Z",
        "updatedAt": "2026-06-19T10:39:39.436Z"
    }
}
```
<br/>

#### **[PATCH]** /ingredients/:id 재료수정 (ADMIN)
**Request**
```json
{
  "unit": "G100",
  "unitPrice": 4200
}
```
**Response**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "id": 7,
        "name": "양파",
        "location": "중국",
        "unit": "G100",
        "unitPrice": 4200,
        "createdAt": "2026-06-19T10:37:11.814Z",
        "updatedAt": "2026-08-10T01:52:40.061Z"
    }
}
```

#### **[DELETE]** /ingredients/:id 재료삭제 (ADMIN)
**Response**
```json
{
    "message": "success",
    "statusCode": 200,
    "chefkit": {
        "deleted": 70
    }
}
```


