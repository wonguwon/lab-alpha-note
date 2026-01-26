-- 블로그 더미 데이터 (20개)
-- userId는 1로 가정 (실제 존재하는 사용자 ID로 변경 필요)

INSERT INTO blogs (user_id, title, content, thumbnail_url, status, visibility, view_count, vote_count, last_activity_at, created_at, updated_at, is_deleted)
VALUES
(1, 'Spring Boot 프로젝트 시작하기', '# Spring Boot 프로젝트 시작하기\n\nSpring Boot는 스프링 기반 애플리케이션을 빠르고 쉽게 만들 수 있도록 도와주는 프레임워크입니다.\n\n## 주요 특징\n- 자동 설정\n- 내장 서버\n- 간편한 의존성 관리\n\n시작하기에 아주 좋은 프레임워크입니다.', 'https://example.com/thumbnails/spring-boot.jpg', 'PUBLISHED', 'PUBLIC', 152, 23, NOW(), NOW(), NOW(), false),

(1, 'JPA N+1 문제 해결하기', '# JPA N+1 문제 해결하기\n\nJPA를 사용할 때 가장 흔하게 만나는 성능 문제가 N+1 문제입니다.\n\n## 해결 방법\n1. Fetch Join 사용\n2. EntityGraph 활용\n3. Batch Size 설정\n\n각 방법의 장단점을 알아봅시다.', 'https://example.com/thumbnails/jpa.jpg', 'PUBLISHED', 'PUBLIC', 287, 45, NOW(), NOW(), NOW(), false),

(1, 'REST API 설계 베스트 프랙티스', '# REST API 설계 베스트 프랙티스\n\nRESTful API를 설계할 때 지켜야 할 원칙들을 정리했습니다.\n\n## 핵심 원칙\n- URI는 리소스를 표현\n- HTTP 메서드로 행위 표현\n- 복수형 명사 사용\n\n실무에서 바로 적용할 수 있는 팁들입니다.', 'https://example.com/thumbnails/rest-api.jpg', 'PUBLISHED', 'PUBLIC', 431, 67, NOW(), NOW(), NOW(), false),

(1, 'Docker로 개발 환경 구축하기', '# Docker로 개발 환경 구축하기\n\nDocker를 사용하면 일관된 개발 환경을 쉽게 구축할 수 있습니다.\n\n## Docker 기본 개념\n- 컨테이너\n- 이미지\n- Docker Compose\n\n팀 전체가 동일한 환경에서 개발할 수 있습니다.', 'https://example.com/thumbnails/docker.jpg', 'PUBLISHED', 'PUBLIC', 198, 31, NOW(), NOW(), NOW(), false),

(1, 'Git 브랜치 전략 (Git Flow)', '# Git 브랜치 전략\n\n효율적인 협업을 위한 Git Flow 브랜치 전략을 소개합니다.\n\n## 주요 브랜치\n- main: 프로덕션 배포\n- develop: 개발 통합\n- feature: 기능 개발\n- hotfix: 긴급 수정\n\n체계적인 버전 관리가 가능합니다.', 'https://example.com/thumbnails/git.jpg', 'PUBLISHED', 'PUBLIC', 356, 52, NOW(), NOW(), NOW(), false),

(1, 'MySQL 인덱스 최적화 가이드', '# MySQL 인덱스 최적화\n\n데이터베이스 성능 향상의 핵심인 인덱스 최적화 방법입니다.\n\n## 인덱스 종류\n- B-Tree 인덱스\n- Hash 인덱스\n- Full-Text 인덱스\n\n실행 계획을 통해 인덱스 효율을 확인할 수 있습니다.', 'https://example.com/thumbnails/mysql.jpg', 'PUBLISHED', 'PUBLIC', 512, 78, NOW(), NOW(), NOW(), false),

(1, 'JWT 인증 구현하기', '# JWT 인증 구현하기\n\nStateless 인증 방식인 JWT를 Spring Security와 함께 구현하는 방법입니다.\n\n## JWT 구조\n- Header\n- Payload\n- Signature\n\n보안성과 확장성을 동시에 확보할 수 있습니다.', 'https://example.com/thumbnails/jwt.jpg', 'PUBLISHED', 'PUBLIC', 624, 89, NOW(), NOW(), NOW(), false),

(1, 'Redis 캐싱 전략', '# Redis 캐싱 전략\n\n애플리케이션 성능을 극대화하는 Redis 캐싱 패턴을 알아봅니다.\n\n## 주요 패턴\n- Cache Aside\n- Write Through\n- Write Behind\n\n각 패턴의 적용 시나리오를 이해해야 합니다.', 'https://example.com/thumbnails/redis.jpg', 'PUBLISHED', 'PUBLIC', 445, 61, NOW(), NOW(), NOW(), false),

(1, 'Gradle vs Maven 비교', '# Gradle vs Maven 비교\n\nJava 프로젝트의 두 대표 빌드 도구를 비교 분석합니다.\n\n## 주요 차이점\n- 빌드 속도\n- 설정 방식\n- 플러그인 생태계\n\n프로젝트 특성에 맞는 도구를 선택하세요.', 'https://example.com/thumbnails/gradle-maven.jpg', 'PUBLISHED', 'PUBLIC', 289, 42, NOW(), NOW(), NOW(), false),

(1, '클린 코드 작성법', '# 클린 코드 작성법\n\n읽기 쉽고 유지보수하기 좋은 코드를 작성하는 원칙입니다.\n\n## 핵심 원칙\n- 의미 있는 네이밍\n- 함수는 한 가지 일만\n- 주석보다는 명확한 코드\n\n코드 품질이 곧 생산성입니다.', 'https://example.com/thumbnails/clean-code.jpg', 'PUBLISHED', 'PUBLIC', 738, 102, NOW(), NOW(), NOW(), false),

(1, 'Spring Security 기본 개념', '# Spring Security 기본 개념\n\n웹 애플리케이션의 보안을 담당하는 Spring Security 핵심 개념입니다.\n\n## 주요 구성 요소\n- Authentication\n- Authorization\n- SecurityContext\n\n체계적인 보안 구조를 제공합니다.', 'https://example.com/thumbnails/spring-security.jpg', 'PUBLISHED', 'PUBLIC', 567, 74, NOW(), NOW(), NOW(), false),

(1, 'AWS S3 파일 업로드 구현', '# AWS S3 파일 업로드 구현\n\nSpring Boot에서 AWS S3를 활용한 파일 업로드 기능을 구현합니다.\n\n## 구현 단계\n1. AWS SDK 설정\n2. S3 Client 구성\n3. Presigned URL 생성\n\n안전하고 효율적인 파일 관리가 가능합니다.', 'https://example.com/thumbnails/aws-s3.jpg', 'PUBLISHED', 'PUBLIC', 412, 58, NOW(), NOW(), NOW(), false),

(1, 'JUnit5 테스트 작성 가이드', '# JUnit5 테스트 작성 가이드\n\n효과적인 단위 테스트를 작성하는 방법을 배워봅니다.\n\n## 주요 어노테이션\n- @Test\n- @BeforeEach\n- @DisplayName\n\n테스트 코드는 문서이자 안전망입니다.', 'https://example.com/thumbnails/junit.jpg', 'PUBLISHED', 'PUBLIC', 334, 47, NOW(), NOW(), NOW(), false),

(1, 'Exception 처리 전략', '# Exception 처리 전략\n\n일관되고 효율적인 예외 처리 방법을 소개합니다.\n\n## 처리 방법\n- @ControllerAdvice\n- Custom Exception\n- 표준 응답 포맷\n\n사용자 친화적인 에러 메시지를 제공하세요.', 'https://example.com/thumbnails/exception.jpg', 'PUBLISHED', 'PUBLIC', 491, 65, NOW(), NOW(), NOW(), false),

(1, 'Lombok 활용 팁', '# Lombok 활용 팁\n\n보일러플레이트 코드를 줄여주는 Lombok 활용법입니다.\n\n## 주요 어노테이션\n- @Data\n- @Builder\n- @NoArgsConstructor\n\n코드 가독성과 생산성을 높일 수 있습니다.', 'https://example.com/thumbnails/lombok.jpg', 'PUBLISHED', 'PUBLIC', 276, 38, NOW(), NOW(), NOW(), false),

(1, 'SOLID 원칙 이해하기', '# SOLID 원칙 이해하기\n\n객체 지향 설계의 5대 원칙을 실무 관점에서 설명합니다.\n\n## SOLID\n- Single Responsibility\n- Open/Closed\n- Liskov Substitution\n- Interface Segregation\n- Dependency Inversion\n\n유지보수성 높은 설계의 기초입니다.', 'https://example.com/thumbnails/solid.jpg', 'PUBLISHED', 'PUBLIC', 658, 91, NOW(), NOW(), NOW(), false),

(1, 'Querydsl로 동적 쿼리 작성', '# Querydsl로 동적 쿼리 작성\n\n타입 안전한 동적 쿼리 작성을 위한 Querydsl 활용법입니다.\n\n## 장점\n- 컴파일 시점 타입 체크\n- IDE 자동완성 지원\n- 복잡한 조인 쿼리 간편화\n\nJPQL보다 안전하고 편리합니다.', 'https://example.com/thumbnails/querydsl.jpg', 'PUBLISHED', 'PUBLIC', 523, 69, NOW(), NOW(), NOW(), false),

(1, 'API 문서화 with Swagger', '# API 문서화 with Swagger\n\nSwagger(OpenAPI)를 활용한 자동 API 문서 생성 방법입니다.\n\n## 설정 방법\n- Springdoc 의존성 추가\n- @Operation 어노테이션\n- UI 커스터마이징\n\n프론트엔드와의 협업이 수월해집니다.', 'https://example.com/thumbnails/swagger.jpg', 'PUBLISHED', 'PUBLIC', 389, 54, NOW(), NOW(), NOW(), false),

(1, '트랜잭션 전파 속성', '# 트랜잭션 전파 속성\n\nSpring의 트랜잭션 전파 옵션을 상황별로 분석합니다.\n\n## 전파 옵션\n- REQUIRED\n- REQUIRES_NEW\n- NESTED\n\n각 옵션의 동작 방식을 정확히 이해해야 합니다.', 'https://example.com/thumbnails/transaction.jpg', 'PUBLISHED', 'PUBLIC', 467, 63, NOW(), NOW(), NOW(), false),

(1, 'Spring AOP 실전 활용', '# Spring AOP 실전 활용\n\n관점 지향 프로그래밍으로 횡단 관심사를 분리하는 방법입니다.\n\n## 활용 사례\n- 로깅\n- 성능 측정\n- 트랜잭션 관리\n\n코드 중복을 제거하고 관심사를 분리할 수 있습니다.', 'https://example.com/thumbnails/aop.jpg', 'PUBLISHED', 'PUBLIC', 542, 76, NOW(), NOW(), NOW(), false);
