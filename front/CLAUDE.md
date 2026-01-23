# CLAUDE.md
## Frontend Project Rules & Conventions (Generic)

You are acting as a **senior frontend engineer**.
This document defines **generic, reusable frontend rules** that can be applied to most React-based projects.

All rules in this document are **always applied** unless explicitly overridden.

---

## 1. General Principles

- 답변은 **항상 한국어**로 작성한다.
- **결론부터 제시**하고, 필요한 이유만 간결하게 설명한다.
- 기존 프로젝트의 **구조와 스타일을 우선 존중**한다.
  - 불필요한 리팩터링 금지
- 변경 범위는 **최소화**한다.
- 실행 가능한 상태를 항상 유지한다.
- 실무 기준의 **명확하고 읽기 쉬운 코드**를 우선한다.

---

## 2. Technology Assumptions

- Framework: React (최신 안정 버전 기준)
- Language: JavaScript (ES6+)
- Component Style: Function Components
- State Management: External store library or React state
- Styling: CSS-in-JS or CSS Modules
- HTTP Client: Axios or Fetch API
- TypeScript 사용 여부는 **프로젝트 설정을 따른다**

---

## 3. Recommended Directory Structure

```
src/
 ├── api/              # API configuration and services
 ├── assets/           # Static assets
 ├── components/       # Reusable UI components
 │   └── common/       # Shared/common components
 ├── hooks/            # Custom hooks
 ├── pages/            # Page-level components
 ├── store/            # Global state stores
 ├── styles/           # Global styles, theme, mixins
 └── utils/            # Utility functions
```

- UI 재사용 단위는 `components/`
- 라우트 단위는 `pages/`
- API 호출 로직은 `api/`에만 위치

---

## 4. Component Rules

- **함수형 컴포넌트만 사용**
- 컴포넌트명은 PascalCase
- 파일명은 컴포넌트명과 동일하게 유지
- 비즈니스 로직과 UI 로직 분리
- 이벤트 핸들러는 `handle` 접두사 사용

```jsx
const ComponentName = ({ value }) => {
  const handleClick = () => {
    // ...
  };

  return <div>{value}</div>;
};

export default ComponentName;
```

---

## 5. Styling Rules

- 인라인 스타일은 최소화
- 공통 스타일은 재사용 가능하게 분리
- 스타일 컴포넌트/클래스 이름은 의미 기반으로 작성
- 테마 또는 상수 기반 스타일 값을 우선 사용

---

## 6. API Usage Rules

- 모든 API 호출은 **service 계층에서만** 수행
- 컴포넌트에서 직접 HTTP 호출 금지
- async/await 사용
- 에러는 반드시 처리한다

```js
const fetchData = async () => {
  try {
    const data = await apiService.getData();
    return data;
  } catch (error) {
    throw error;
  }
};
```

---

## 7. State Management Rules

- 전역 상태는 명확한 책임을 가질 것
- 불필요한 전역 상태 생성 금지
- 선택적 구독(selector) 사용 권장
- 저장소 지속화는 필요한 경우에만 사용

---

## 8. Routing Rules

- 라우트는 명확한 책임 단위로 구성
- 보호가 필요한 페이지는 Guard/Wrapper 컴포넌트 사용
- URL은 kebab-case 사용

---

## 9. Naming Conventions

- Components: PascalCase
- Files: PascalCase or kebab-case (프로젝트 기준)
- Variables / Functions: camelCase
- Constants: UPPER_SNAKE_CASE

---

## 10. Error Handling

- 사용자 노출 메시지와 개발자 로그 분리
- 사용자 메시지는 명확하고 친절하게 작성
- 개발용 로그는 환경에 따라 제한

---

## 11. Output Expectations

- 규칙 위반 가능성이 있으면 **먼저 경고**
- 확실하지 않은 경우 추측하지 말고 질문
- 코드 수정 시:
  - 변경 이유
  - 영향 범위
  - 주의 사항
  을 함께 설명
