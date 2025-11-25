# Habit API 문서

습관 기록 기능 API 명세서 (v1.0)

---

## 📋 목차

1. [개요](#개요)
2. [인증](#인증)
3. [공통 응답 형식](#공통-응답-형식)
4. [습관 관리 API](#습관-관리-api)
5. [습관 기록 API](#습관-기록-api)
6. [데이터 모델](#데이터-모델)
7. [에러 코드](#에러-코드)
8. [예시 시나리오](#예시-시나리오)

---

## 개요

습관 기록 기능은 사용자가 자신의 습관을 만들고, 매일 실행 여부를 기록하며, GitHub 잔디처럼 시각화된 달력과 연속 기록일(Streak)을 확인할 수 있는 기능입니다.

### 주요 기능

- ✅ 습관 생성 및 관리 (생성, 조회, 수정, 삭제, 보관)
- ✅ 일별 습관 기록 (하루 여러 번 기록 가능)
- ✅ GitHub 잔디 스타일 캘린더 (날짜별 기록 횟수 시각화)
- ✅ Streak(연속 기록일) 자동 계산
- ✅ 통계 조회 (현재/최장 연속일, 총 기록 횟수 등)
- ⚡️ **대시보드 API** (습관 목록 + 잔디 데이터 한 번에 조회, 98% 성능 향상)
- 🔓 **모든 조회 API 비로그인 허용** (공개 습관 공유 가능)

### 기술 스펙

- **Base URL**: `http://localhost:8001/api/v1`
- **인증 방식**: JWT Bearer Token
- **Content-Type**: `application/json`
- **문자 인코딩**: UTF-8
- **시간대**: UTC (ISO-8601 포맷)

---

## 인증

### 인증 정책

- **📖 조회 API (GET)**: 인증 **불필요** (비로그인 사용자도 접근 가능)
- **✏️ 생성/수정/삭제 API (POST/PUT/DELETE)**: 인증 **필수** (JWT 토큰 필요)

### 헤더 설정

**인증이 필요한 요청**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**인증이 불필요한 요청 (GET)**
```http
Content-Type: application/json
```

### 예시

**조회 요청 (인증 불필요)**
```bash
curl -X GET http://localhost:8001/api/v1/habits \
  -H "Content-Type: application/json"
```

**생성 요청 (인증 필요)**
```bash
curl -X POST http://localhost:8001/api/v1/habits \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"title": "운동하기", ...}'
```

---

## 공통 응답 형식

모든 API 응답은 `ApiResponse<T>` 래퍼로 감싸져 있습니다.

### 성공 응답

```json
{
  "success": true,
  "message": "요청 성공 메시지",
  "data": {
    // 실제 데이터
  }
}
```

### 실패 응답

```json
{
  "success": false,
  "message": "에러 메시지",
  "code": "H001",
  "data": null
}
```

### HTTP 상태 코드

| 상태 코드 | 의미 |
|---------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복 등) |
| 500 | 서버 에러 |

---

## 습관 관리 API

### 1. 습관 생성

새로운 습관을 생성합니다.

**Endpoint**
```
POST /api/v1/habits
```

**Request Body**
```json
{
  "title": "운동하기",
  "description": "매일 30분 이상 운동하기",
  "color": "#10B981",
  "targetCount": 1,
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

| 필드 | 타입 | 필수 | 설명 | 제약 조건 |
|------|------|------|------|-----------|
| title | string | ✅ | 습관명 | 최대 100자 |
| description | string | ❌ | 습관 설명 | 최대 1000자 |
| color | string | ❌ | HEX 색상 코드 | 정규식: `^#[0-9A-Fa-f]{6}$` |
| targetCount | number | ✅ | 하루 목표 횟수 | 1~100 |
| startDate | string | ✅ | 시작일 | ISO-8601 날짜 (YYYY-MM-DD) |
| endDate | string | ❌ | 종료일 (무기한이면 생략) | ISO-8601 날짜, startDate 이후 |

**Response** (201 Created)
```json
{
  "success": true,
  "message": "습관이 성공적으로 생성되었습니다.",
  "data": {
    "id": 1,
    "userId": 123,
    "title": "운동하기",
    "description": "매일 30분 이상 운동하기",
    "color": "#10B981",
    "targetCount": 1,
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "currentStreak": 0,
    "longestStreak": 0,
    "totalRecords": 0,
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 2. 습관 대시보드 조회 🔓⭐️ (최적화)

습관 목록 + 잔디 캘린더 데이터를 **한 번에** 조회합니다. **인증 불필요**

> ⚡️ **성능 최적화**: 기존 61번 API 호출 → 1번으로 98% 감소

**Endpoint**
```
GET /api/v1/habits/dashboard?userId={userId}&status={status}&startMonth={startMonth}&endMonth={endMonth}&page={page}&size={size}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|------|------|--------|
| userId | number | ❌ | 특정 사용자의 습관만 조회 (없으면 전체 조회) | null |
| status | string | ❌ | 습관 상태 (ACTIVE, ARCHIVED) | null (DELETED 제외) |
| startMonth | string | ❌ | 잔디 시작 월 (YYYY-MM) | 현재-6개월 |
| endMonth | string | ❌ | 잔디 종료 월 (YYYY-MM) | 현재월 |
| page | number | ❌ | 페이지 번호 (0부터 시작) | 0 |
| size | number | ❌ | 페이지 크기 | 20 |
| sort | string | ❌ | 정렬 (예: createdAt,desc) | createdAt,desc |

**예시 요청**
```bash
# 최근 6개월 데이터 (기본값)
GET /api/v1/habits/dashboard?userId=123&status=ACTIVE

# 커스텀 날짜 범위
GET /api/v1/habits/dashboard?userId=123&startMonth=2024-06&endMonth=2025-01&size=100
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "대시보드 조회 성공",
  "data": {
    "habits": [
      {
        "id": 1,
        "userId": 123,
        "title": "운동하기",
        "description": "매일 30분 이상 운동하기",
        "color": "#10B981",
        "targetCount": 1,
        "startDate": "2025-01-01",
        "currentStreak": 5,
        "longestStreak": 10,
        "totalRecords": 15,
        "status": "ACTIVE",
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-01-20T08:00:00Z",
        "calendar": {
          "2024-06-01": 1,
          "2024-06-15": 2,
          "2024-07-10": 1,
          "2025-01-20": 1
        }
      }
    ],
    "totalElements": 10,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 20
  }
}
```

**특징**
- ✅ 습관 정보 + 통계 + 잔디 데이터 **한 번에** 조회
- ✅ N+1 문제 해결 (IN 쿼리 사용)
- ✅ 날짜 범위 동적 지정 가능
- ✅ 비로그인 사용자도 접근 가능

**프론트엔드 사용 예시**
```javascript
const { habits } = await habitService.getHabitDashboard({
  userId: user.id,
  status: 'ACTIVE',
  startMonth: '2024-06',
  endMonth: '2025-01',
  size: 100
});

// 각 습관의 calendar 필드에 잔디 데이터 포함
habits.forEach(habit => {
  const calendarData = habit.calendar; // { "2024-06-01": 1, ... }
  renderCalendar(calendarData);
});
```

---

### 3. 습관 목록 조회 🔓 (레거시)

습관 목록을 페이징으로 조회합니다. **인증 불필요**

> ℹ️ **권장**: 잔디 데이터가 필요한 경우 위의 대시보드 API 사용 권장

**Endpoint**
```
GET /api/v1/habits?userId={userId}&status={status}&page={page}&size={size}&sort={sort}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|------|------|--------|
| userId | number | ❌ | 특정 사용자의 습관만 조회 (없으면 전체 조회, 로그인 여부 무관) | null |
| status | string | ❌ | 습관 상태 (ACTIVE, ARCHIVED, DELETED) | null (DELETED 제외) |
| page | number | ❌ | 페이지 번호 (0부터 시작) | 0 |
| size | number | ❌ | 페이지 크기 | 20 |
| sort | string | ❌ | 정렬 (예: createdAt,desc) | createdAt,desc |

**예시 요청**
```bash
# 전체 습관 조회 (비로그인)
GET /api/v1/habits?page=0&size=10

# 특정 사용자의 습관만 조회
GET /api/v1/habits?userId=123&status=ACTIVE&page=0&size=10&sort=createdAt,desc
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "습관 목록 조회 성공",
  "data": {
    "content": [
      {
        "id": 1,
        "userId": 123,
        "title": "운동하기",
        "description": "매일 30분 이상 운동하기",
        "color": "#10B981",
        "targetCount": 1,
        "startDate": "2025-01-01",
        "currentStreak": 5,
        "longestStreak": 10,
        "totalRecords": 15,
        "status": "ACTIVE",
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-01-20T08:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": { "sorted": true },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalElements": 1,
    "totalPages": 1,
    "last": true,
    "first": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 1,
    "empty": false
  }
}
```

---

### 3. 습관 상세 조회 🔓

특정 습관의 상세 정보를 조회합니다. **인증 불필요**

**Endpoint**
```
GET /api/v1/habits/{id}
```

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | number | 습관 ID |

**Response** (200 OK)
```json
{
  "success": true,
  "message": "습관 조회 성공",
  "data": {
    "id": 1,
    "userId": 123,
    "title": "운동하기",
    "description": "매일 30분 이상 운동하기",
    "color": "#10B981",
    "targetCount": 1,
    "startDate": "2025-01-01",
    "currentStreak": 5,
    "longestStreak": 10,
    "totalRecords": 15,
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-20T08:00:00Z"
  }
}
```

**Error Response** (404 Not Found)
```json
{
  "success": false,
  "message": "습관을 찾을 수 없습니다.",
  "code": "H001",
  "data": null
}
```

---

### 4. 습관 수정

습관 정보를 수정합니다.

**Endpoint**
```
PUT /api/v1/habits/{id}
```

**Request Body**
```json
{
  "title": "아침 운동하기",
  "description": "매일 아침 30분 이상 운동하기",
  "color": "#3B82F6",
  "targetCount": 1,
  "endDate": "2025-12-31"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | ✅ | 습관명 (최대 100자) |
| description | string | ❌ | 습관 설명 (최대 1000자) |
| color | string | ❌ | HEX 색상 코드 |
| targetCount | number | ✅ | 하루 목표 횟수 (1~100) |
| endDate | string | ❌ | 종료일 (무기한이면 생략/null) |

**Response** (200 OK)
```json
{
  "success": true,
  "message": "습관이 성공적으로 수정되었습니다.",
  "data": {
    "id": 1,
    "userId": 123,
    "title": "아침 운동하기",
    "description": "매일 아침 30분 이상 운동하기",
    "color": "#3B82F6",
    "targetCount": 1,
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "currentStreak": 5,
    "longestStreak": 10,
    "totalRecords": 15,
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-20T15:30:00Z"
  }
}
```

---

### 5. 습관 삭제

습관을 삭제합니다 (Soft Delete).

**Endpoint**
```
DELETE /api/v1/habits/{id}
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "습관이 성공적으로 삭제되었습니다.",
  "data": null
}
```

---

### 6. 습관 보관

습관을 보관 상태로 변경합니다.

**Endpoint**
```
POST /api/v1/habits/{id}/archive
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "습관이 보관되었습니다.",
  "data": {
    "id": 1,
    "status": "ARCHIVED",
    // ... 기타 필드
  }
}
```

---

### 7. 습관 활성화

보관된 습관을 다시 활성화합니다.

**Endpoint**
```
POST /api/v1/habits/{id}/activate
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "습관이 활성화되었습니다.",
  "data": {
    "id": 1,
    "status": "ACTIVE",
    // ... 기타 필드
  }
}
```

---

### 8. 습관 통계 조회 🔓

습관의 통계 정보를 조회합니다. **인증 불필요**

**Endpoint**
```
GET /api/v1/habits/{id}/stats
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "통계 조회 성공",
  "data": {
    "currentStreak": 5,
    "longestStreak": 10,
    "totalRecords": 15,
    "totalDays": 12,
    "totalCount": 20
  }
}
```

| 필드 | 설명 |
|------|------|
| currentStreak | 현재 연속 기록일 |
| longestStreak | 최장 연속 기록일 |
| totalRecords | 전체 기록 개수 |
| totalDays | 기록된 날짜 개수 (중복 제거) |
| totalCount | 전체 횟수 합계 |

---

## 습관 기록 API

### 1. 습관 기록 생성

새로운 습관 기록을 생성합니다.

**Endpoint**
```
POST /api/v1/habits/{habitId}/records
```

**Request Body**
```json
{
  "recordDate": "2025-01-20",
  "count": 1,
  "note": "오늘도 열심히 운동했습니다!"
}
```

| 필드 | 타입 | 필수 | 설명 | 제약 조건 |
|------|------|------|------|-----------|
| recordDate | string | ✅ | 기록 날짜 | ISO-8601 날짜, 미래 날짜 불가, 습관 시작일 이후 |
| count | number | ✅ | 실행 횟수 | 1~100 |
| note | string | ❌ | 메모 | 최대 1000자 |

**Response** (201 Created)
```json
{
  "success": true,
  "message": "기록이 성공적으로 생성되었습니다.",
  "data": {
    "id": 1,
    "habitId": 1,
    "userId": 123,
    "recordDate": "2025-01-20",
    "loggedAt": "2025-01-20T10:30:00Z",
    "count": 1,
    "note": "오늘도 열심히 운동했습니다!",
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  }
}
```

**Error Response** (400 Bad Request)
```json
{
  "success": false,
  "message": "미래 날짜에 기록을 남길 수 없습니다.",
  "code": "H008",
  "data": null
}
```

---

### 2. 습관 기록 목록 조회 🔓

습관의 기록 목록을 페이징으로 조회합니다. **인증 불필요**

**Endpoint**
```
GET /api/v1/habits/{habitId}/records?page={page}&size={size}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 기본값 |
|---------|------|------|--------|
| page | number | ❌ | 0 |
| size | number | ❌ | 20 |
| sort | string | ❌ | recordDate,desc |

**Response** (200 OK)
```json
{
  "success": true,
  "message": "기록 목록 조회 성공",
  "data": {
    "content": [
      {
        "id": 1,
        "habitId": 1,
        "userId": 123,
        "recordDate": "2025-01-20",
        "loggedAt": "2025-01-20T10:30:00Z",
        "count": 1,
        "note": "오늘도 열심히 운동했습니다!",
        "createdAt": "2025-01-20T10:30:00Z",
        "updatedAt": "2025-01-20T10:30:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 20,
    "number": 0
  }
}
```

---

### 3. 특정 날짜의 기록 조회 🔓

특정 날짜의 모든 기록을 조회합니다 (하루에 여러 기록 가능). **인증 불필요**

**Endpoint**
```
GET /api/v1/habits/{habitId}/records/date/{date}
```

**Path Parameters**

| 파라미터 | 타입 | 설명 | 예시 |
|---------|------|------|------|
| habitId | number | 습관 ID | 1 |
| date | string | 날짜 (ISO-8601) | 2025-01-20 |

**Response** (200 OK)
```json
{
  "success": true,
  "message": "날짜별 기록 조회 성공",
  "data": [
    {
      "id": 1,
      "habitId": 1,
      "userId": 123,
      "recordDate": "2025-01-20",
      "loggedAt": "2025-01-20T08:00:00Z",
      "count": 1,
      "note": "아침 운동",
      "createdAt": "2025-01-20T08:00:00Z",
      "updatedAt": "2025-01-20T08:00:00Z"
    },
    {
      "id": 2,
      "habitId": 1,
      "userId": 123,
      "recordDate": "2025-01-20",
      "loggedAt": "2025-01-20T18:00:00Z",
      "count": 1,
      "note": "저녁 운동",
      "createdAt": "2025-01-20T18:00:00Z",
      "updatedAt": "2025-01-20T18:00:00Z"
    }
  ]
}
```

---

### 4. 습관 기록 상세 조회 🔓

특정 기록의 상세 정보를 조회합니다. **인증 불필요**

**Endpoint**
```
GET /api/v1/habits/{habitId}/records/{recordId}
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "기록 조회 성공",
  "data": {
    "id": 1,
    "habitId": 1,
    "userId": 123,
    "recordDate": "2025-01-20",
    "loggedAt": "2025-01-20T10:30:00Z",
    "count": 1,
    "note": "오늘도 열심히 운동했습니다!",
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  }
}
```

---

### 5. 습관 기록 수정

기록의 횟수와 메모를 수정합니다.

**Endpoint**
```
PUT /api/v1/habits/{habitId}/records/{recordId}
```

**Request Body**
```json
{
  "count": 2,
  "note": "오늘은 2번 운동했어요!"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "기록이 성공적으로 수정되었습니다.",
  "data": {
    "id": 1,
    "count": 2,
    "note": "오늘은 2번 운동했어요!",
    // ... 기타 필드
  }
}
```

---

### 6. 습관 기록 삭제

기록을 삭제합니다 (Soft Delete).

**Endpoint**
```
DELETE /api/v1/habits/{habitId}/records/{recordId}
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "기록이 성공적으로 삭제되었습니다.",
  "data": null
}
```

---

### 7. 월별 잔디 데이터 조회 🔓⭐️

GitHub 잔디처럼 월별 기록 데이터를 조회합니다. **인증 불필요**

**Endpoint**
```
GET /api/v1/habits/{habitId}/records/calendar?yearMonth={yearMonth}
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|---------|------|------|------|------|
| yearMonth | string | ✅ | 조회할 년월 | 2025-01 |

**예시 요청**
```bash
GET /api/v1/habits/1/records/calendar?yearMonth=2025-01
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "캘린더 조회 성공",
  "data": {
    "yearMonth": "2025-01",
    "recordCountByDate": {
      "2025-01-01": 1,
      "2025-01-02": 2,
      "2025-01-03": 1,
      "2025-01-05": 3,
      "2025-01-10": 1,
      "2025-01-15": 2,
      "2025-01-20": 1
    }
  }
}
```

**프론트엔드 활용 예시**
```javascript
// 잔디 색상 강도 계산
const getIntensity = (count) => {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count >= 3) return 3;
};

// 날짜별 색상 클래스 적용
const data = response.data.recordCountByDate;
Object.entries(data).forEach(([date, count]) => {
  const intensity = getIntensity(count);
  // intensity에 따라 bg-green-100, bg-green-300, bg-green-500, bg-green-700 적용
});
```

---

## 데이터 모델

### HabitStatus (Enum)

습관의 상태를 나타냅니다.

| 값 | 설명 |
|---|------|
| ACTIVE | 활성 |
| ARCHIVED | 보관됨 |
| DELETED | 삭제됨 |

---

### HabitResponse

```typescript
interface HabitResponse {
  id: number;                 // 습관 ID
  userId: number;             // 사용자 ID
  title: string;              // 습관명
  description?: string;       // 설명
  color: string;              // HEX 색상 코드
  targetCount: number;        // 하루 목표 횟수
  startDate: string;          // 시작일 (YYYY-MM-DD)
  endDate?: string;           // 종료일 (YYYY-MM-DD, 무기한이면 null)
  currentStreak: number;      // 현재 연속일
  longestStreak: number;      // 최장 연속일
  totalRecords: number;       // 전체 기록 개수
  status: HabitStatus;        // 상태
  createdAt: string;          // 생성일 (ISO-8601)
  updatedAt: string;          // 수정일 (ISO-8601)
}
```

---

### HabitRecordResponse

```typescript
interface HabitRecordResponse {
  id: number;                 // 기록 ID
  habitId: number;            // 습관 ID
  userId: number;             // 사용자 ID
  recordDate: string;         // 기록 날짜 (YYYY-MM-DD)
  loggedAt: string;           // 실제 기록 시각 (ISO-8601)
  count: number;              // 실행 횟수
  note?: string;              // 메모
  createdAt: string;          // 생성일
  updatedAt: string;          // 수정일
}
```

---

### HabitStatsResponse

```typescript
interface HabitStatsResponse {
  currentStreak: number;      // 현재 연속일
  longestStreak: number;      // 최장 연속일
  totalRecords: number;       // 전체 기록 개수
  totalDays: number;          // 기록된 날짜 개수 (중복 제거)
  totalCount: number;         // 전체 횟수 합계
}
```

---

### HabitCalendarResponse

```typescript
interface HabitCalendarResponse {
  yearMonth: string;                          // 년월 (YYYY-MM)
  recordCountByDate: Record<string, number>;  // 날짜별 기록 횟수
}
```

---

### HabitWithCalendarDTO (대시보드 API 전용)

```typescript
interface HabitWithCalendarDTO {
  // 기본 습관 정보
  id: number;
  userId: number;
  title: string;
  description?: string;
  color: string;
  targetCount: number;
  startDate: string;
  endDate?: string;

  // 통계 정보
  currentStreak: number;
  longestStreak: number;
  totalRecords: number;

  // 상태 정보
  status: HabitStatus;
  createdAt: string;
  updatedAt: string;

  // 잔디 캘린더 데이터 (날짜별 기록 횟수)
  calendar: Record<string, number>;  // { "2024-06-01": 1, "2024-06-15": 2, ... }
}
```

---

### HabitDashboardResponse (대시보드 API 전용)

```typescript
interface HabitDashboardResponse {
  habits: HabitWithCalendarDTO[];  // 습관 목록 (잔디 데이터 포함)
  totalElements: number;            // 전체 요소 개수
  totalPages: number;               // 전체 페이지 수
  currentPage: number;              // 현재 페이지 번호
  pageSize: number;                 // 페이지 크기
}
```

---

## 에러 코드

### Habit 관련 에러 (H001~H010)

| 코드 | HTTP Status | 메시지 | 설명 |
|------|-------------|--------|------|
| H001 | 404 | 습관을 찾을 수 없습니다. | 존재하지 않는 습관 ID |
| H002 | 403 | 습관에 접근할 권한이 없습니다. | 다른 사용자의 습관 접근 시도 |
| H003 | 404 | 습관 기록을 찾을 수 없습니다. | 존재하지 않는 기록 ID |
| H004 | 403 | 습관 기록에 접근할 권한이 없습니다. | 다른 사용자의 기록 접근 시도 |
| H005 | 409 | 이미 보관된 습관입니다. | 보관된 습관을 다시 보관 시도 |
| H006 | 409 | 이미 활성 상태인 습관입니다. | 활성 상태의 습관을 활성화 시도 |
| H007 | 410 | 삭제된 습관입니다. | 삭제된 습관 접근 시도 |
| H008 | 400 | 미래 날짜에 기록을 남길 수 없습니다. | 미래 날짜로 기록 생성 시도 |
| H009 | 400 | 습관 시작일 이전에 기록을 남길 수 없습니다. | 시작일 이전 날짜로 기록 생성 |
| H010 | 400 | 습관 종료일 이후에 기록을 남길 수 없습니다. | 종료일 이후 날짜로 기록 생성 시도 |

### 공통 에러

| 코드 | HTTP Status | 메시지 |
|------|-------------|--------|
| A001 | 401 | 인증이 필요합니다. |
| A002 | 401 | 유효하지 않은 토큰입니다. |
| C002 | 400 | 잘못된 입력값입니다. |

---

## 예시 시나리오

### 시나리오 1: 새로운 습관 생성 및 첫 기록

**1단계: 습관 생성**
```bash
POST /api/v1/habits
{
  "title": "물 8잔 마시기",
  "description": "하루 2L 물 마시기",
  "color": "#3B82F6",
  "targetCount": 8,
  "startDate": "2025-01-20"
}
```

**2단계: 오늘 기록 추가**
```bash
POST /api/v1/habits/1/records
{
  "recordDate": "2025-01-20",
  "count": 2,
  "note": "오전에 2잔 마심"
}
```

**3단계: 추가 기록**
```bash
POST /api/v1/habits/1/records
{
  "recordDate": "2025-01-20",
  "count": 3,
  "note": "점심 식사 후 3잔"
}
```

**4단계: 오늘 기록 확인**
```bash
GET /api/v1/habits/1/records/date/2025-01-20

Response:
[
  { "id": 1, "count": 2, "note": "오전에 2잔 마심" },
  { "id": 2, "count": 3, "note": "점심 식사 후 3잔" }
]
// 총 5잔 마심 (목표: 8잔)
```

---

### 시나리오 2: 월별 잔디 데이터 조회 및 시각화

**1단계: 1월 데이터 조회**
```bash
GET /api/v1/habits/1/records/calendar?yearMonth=2025-01

Response:
{
  "yearMonth": "2025-01",
  "recordCountByDate": {
    "2025-01-20": 2,
    "2025-01-21": 3,
    "2025-01-22": 1,
    "2025-01-23": 2
  }
}
```

**2단계: 프론트엔드 시각화 (React 예시)**
```jsx
const HabitCalendar = ({ data }) => {
  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-200';
    if (count === 2) return 'bg-green-400';
    return 'bg-green-600';
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {daysInMonth.map(date => {
        const count = data.recordCountByDate[date] || 0;
        return (
          <div
            key={date}
            className={`w-8 h-8 rounded ${getColor(count)}`}
            title={`${date}: ${count}회`}
          />
        );
      })}
    </div>
  );
};
```

---

### 시나리오 3: Streak 계산 확인

**연속 기록 예시**
```
2025-01-20: ✅ 기록 있음
2025-01-21: ✅ 기록 있음
2025-01-22: ✅ 기록 있음
2025-01-23: ❌ 기록 없음
2025-01-24: ✅ 기록 있음 (오늘)
```

**통계 조회**
```bash
GET /api/v1/habits/1/stats

Response:
{
  "currentStreak": 1,     // 오늘만 기록 (어제 기록 없음)
  "longestStreak": 3,     // 1월 20~22일 (3일 연속)
  "totalRecords": 8,
  "totalDays": 4,
  "totalCount": 12
}
```

---

## 프론트엔드 구현 팁

### 1. 잔디 캘린더 구현

```javascript
// API 호출 (조회 API는 인증 불필요)
const fetchCalendar = async (habitId, yearMonth) => {
  const response = await fetch(
    `/api/v1/habits/${habitId}/records/calendar?yearMonth=${yearMonth}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.json();
};

// 색상 강도 계산
const getIntensityClass = (count, targetCount) => {
  const percentage = (count / targetCount) * 100;
  if (percentage === 0) return 'bg-gray-100';
  if (percentage < 50) return 'bg-green-200';
  if (percentage < 100) return 'bg-green-400';
  return 'bg-green-600';
};
```

### 2. Streak 표시

```jsx
const StreakBadge = ({ currentStreak }) => (
  <div className="flex items-center gap-2">
    <span className="text-2xl">🔥</span>
    <span className="text-xl font-bold">{currentStreak}</span>
    <span className="text-sm text-gray-600">일 연속</span>
  </div>
);
```

### 3. 실시간 통계 업데이트

기록 생성/삭제 후 Streak가 자동 재계산되므로:
```javascript
// 기록 생성 후
await createRecord(habitId, recordData);

// 습관 상세 조회로 업데이트된 Streak 확인
const habit = await fetchHabit(habitId);
console.log('Updated streak:', habit.currentStreak);
```

### 4. 날짜 포맷팅

```javascript
// ISO-8601 날짜를 로컬 형식으로 변환
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

### 5. 인증 처리

```javascript
// 조회 API는 인증 불필요
const getHabit = async (habitId) => {
  const response = await fetch(`/api/v1/habits/${habitId}`);
  return response.json();
};

// 생성/수정/삭제 API는 인증 필요
const createHabit = async (data, token) => {
  const response = await fetch('/api/v1/habits', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

// 범용 API 호출 함수
const apiCall = async (url, options = {}, requireAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (requireAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  return response.json();
};

// 사용 예시
const habits = await apiCall('/api/v1/habits', {}, false); // 조회
const created = await apiCall('/api/v1/habits', { method: 'POST', body: JSON.stringify(data) }, true); // 생성
```

---

