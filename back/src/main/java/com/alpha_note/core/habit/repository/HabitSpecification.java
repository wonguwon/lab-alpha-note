package com.alpha_note.core.habit.repository;

import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.enums.HabitSearchType;
import com.alpha_note.core.habit.enums.HabitStatus;
import com.alpha_note.core.user.entity.User;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class HabitSpecification {

    /**
     * 종료일 필터 (expired)
     * - true: 종료일이 지난 습관만
     * - false: 종료일이 없거나 아직 안 지난 습관만
     * - null: 전체 (필터 안 함)
     */
    public static Specification<Habit> hasExpiredStatus(Boolean expired) {
        return (root, query, criteriaBuilder) -> {
            if (expired == null) {
                return null; // 필터 적용 안 함
            }

            LocalDate today = LocalDate.now();

            if (expired) {
                // 종료일이 지난 것만: endDate IS NOT NULL AND endDate < today
                return criteriaBuilder.and(
                        criteriaBuilder.isNotNull(root.get("endDate")),
                        criteriaBuilder.lessThan(root.get("endDate"), today)
                );
            } else {
                // 종료일이 없거나 아직 안 지난 것: endDate IS NULL OR endDate >= today
                return criteriaBuilder.or(
                        criteriaBuilder.isNull(root.get("endDate")),
                        criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), today)
                );
            }
        };
    }

    /**
     * 사용자 ID 필터
     */
    public static Specification<Habit> hasUserId(Long userId) {
        return (root, query, criteriaBuilder) -> {
            if (userId == null) {
                return null;
            }
            return criteriaBuilder.equal(root.get("userId"), userId);
        };
    }

    /**
     * 상태 필터
     */
    public static Specification<Habit> hasStatus(HabitStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) {
                return null;
            }
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    /**
     * 상태가 아닌 것 필터 (DELETED 제외용)
     */
    public static Specification<Habit> hasStatusNot(HabitStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) {
                return null;
            }
            return criteriaBuilder.notEqual(root.get("status"), status);
        };
    }

    /**
     * 제목 검색
     */
    public static Specification<Habit> titleContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return null;
            }
            return criteriaBuilder.like(root.get("title"), "%" + keyword + "%");
        };
    }

    /**
     * 작성자 닉네임 검색
     */
    public static Specification<Habit> authorContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return null;
            }
            Join<Habit, User> userJoin = root.join("userId");
            return criteriaBuilder.like(userJoin.get("nickname"), "%" + keyword + "%");
        };
    }

    /**
     * 복합 조건: userId, status, expired 결합
     */
    public static Specification<Habit> withFilters(Long userId, HabitStatus status, Boolean statusNot, Boolean expired) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // userId 필터
            if (userId != null) {
                predicates.add(criteriaBuilder.equal(root.get("userId"), userId));
            }

            // status 필터
            if (status != null) {
                if (statusNot != null && statusNot) {
                    predicates.add(criteriaBuilder.notEqual(root.get("status"), status));
                } else {
                    predicates.add(criteriaBuilder.equal(root.get("status"), status));
                }
            }

            // expired 필터
            if (expired != null) {
                LocalDate today = LocalDate.now();
                if (expired) {
                    predicates.add(criteriaBuilder.and(
                            criteriaBuilder.isNotNull(root.get("endDate")),
                            criteriaBuilder.lessThan(root.get("endDate"), today)
                    ));
                } else {
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.isNull(root.get("endDate")),
                            criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), today)
                    ));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * 검색 조건 (검색 타입 + 키워드 + 필터들)
     */
    public static Specification<Habit> withSearch(
            Long userId,
            HabitStatus status,
            String keyword,
            HabitSearchType searchType,
            Boolean expired
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. 검색 조건
            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchKeyword = "%" + keyword.trim() + "%";

                switch (searchType) {
                    case TITLE:
                        predicates.add(criteriaBuilder.like(root.get("title"), searchKeyword));
                        break;

                    case AUTHOR:
                        Join<Habit, User> userJoin = root.join("userId");
                        predicates.add(criteriaBuilder.like(userJoin.get("nickname"), searchKeyword));
                        break;

                    case ALL:
                    default:
                        Join<Habit, User> userJoinAll = root.join("userId");
                        predicates.add(criteriaBuilder.or(
                                criteriaBuilder.like(root.get("title"), searchKeyword),
                                criteriaBuilder.like(userJoinAll.get("nickname"), searchKeyword)
                        ));
                        break;
                }
            }

            // 2. userId 필터
            if (userId != null) {
                predicates.add(criteriaBuilder.equal(root.get("userId"), userId));
            }

            // 3. status 필터 (기본적으로 DELETED 제외)
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            } else {
                predicates.add(criteriaBuilder.notEqual(root.get("status"), HabitStatus.DELETED));
            }

            // 4. expired 필터
            if (expired != null) {
                LocalDate today = LocalDate.now();
                if (expired) {
                    predicates.add(criteriaBuilder.and(
                            criteriaBuilder.isNotNull(root.get("endDate")),
                            criteriaBuilder.lessThan(root.get("endDate"), today)
                    ));
                } else {
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.isNull(root.get("endDate")),
                            criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), today)
                    ));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * 종료일 우선순위 정렬이 포함된 검색 조건
     * - 1차: 종료일 만료 여부 (미만료/없음 우선, 만료 뒤로)
     * - 2차: sortField (LATEST, CURRENT_STREAK 등)
     */
    public static Specification<Habit> withSearchAndExpiredSort(
            Long userId,
            HabitStatus status,
            String keyword,
            HabitSearchType searchType,
            Boolean expired,
            String sortField
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. 검색 조건
            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchKeyword = "%" + keyword.trim() + "%";

                switch (searchType) {
                    case TITLE:
                        predicates.add(criteriaBuilder.like(root.get("title"), searchKeyword));
                        break;

                    case AUTHOR:
                        Join<Habit, User> userJoin = root.join("userId");
                        predicates.add(criteriaBuilder.like(userJoin.get("nickname"), searchKeyword));
                        break;

                    case ALL:
                    default:
                        Join<Habit, User> userJoinAll = root.join("userId");
                        predicates.add(criteriaBuilder.or(
                                criteriaBuilder.like(root.get("title"), searchKeyword),
                                criteriaBuilder.like(userJoinAll.get("nickname"), searchKeyword)
                        ));
                        break;
                }
            }

            // 2. userId 필터
            if (userId != null) {
                predicates.add(criteriaBuilder.equal(root.get("userId"), userId));
            }

            // 3. status 필터 (기본적으로 DELETED 제외)
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            } else {
                predicates.add(criteriaBuilder.notEqual(root.get("status"), HabitStatus.DELETED));
            }

            // 4. expired 필터
            if (expired != null) {
                LocalDate today = LocalDate.now();
                if (expired) {
                    predicates.add(criteriaBuilder.and(
                            criteriaBuilder.isNotNull(root.get("endDate")),
                            criteriaBuilder.lessThan(root.get("endDate"), today)
                    ));
                } else {
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.isNull(root.get("endDate")),
                            criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), today)
                    ));
                }
            }

            // 5. 정렬 설정 (종료일 만료 여부 우선, 그 다음 sortField)
            if (query != null) {
                LocalDate today = LocalDate.now();

                // 종료일 우선순위 계산
                // CASE WHEN endDate IS NULL OR endDate >= today THEN 0 ELSE 1 END
                Expression<Integer> expiredPriority = criteriaBuilder.<Integer>selectCase()
                        .when(
                                criteriaBuilder.or(
                                        criteriaBuilder.isNull(root.get("endDate")),
                                        criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), today)
                                ),
                                criteriaBuilder.literal(0)
                        )
                        .otherwise(criteriaBuilder.literal(1));

                List<Order> orders = new ArrayList<>();

                // 1차: 종료일 우선순위 (ASC: 0이 먼저, 1이 나중)
                orders.add(criteriaBuilder.asc(expiredPriority));

                // 2차: 사용자가 선택한 정렬 필드 (DESC)
                if (sortField != null && !sortField.isEmpty()) {
                    orders.add(criteriaBuilder.desc(root.get(sortField)));
                }

                query.orderBy(orders);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * 종료일 우선순위 정렬이 포함된 필터 조건
     */
    public static Specification<Habit> withFiltersAndExpiredSort(
            Long userId,
            HabitStatus status,
            Boolean statusNot,
            Boolean expired,
            String sortField
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // userId 필터
            if (userId != null) {
                predicates.add(criteriaBuilder.equal(root.get("userId"), userId));
            }

            // status 필터
            if (status != null) {
                if (statusNot != null && statusNot) {
                    predicates.add(criteriaBuilder.notEqual(root.get("status"), status));
                } else {
                    predicates.add(criteriaBuilder.equal(root.get("status"), status));
                }
            }

            // expired 필터
            if (expired != null) {
                LocalDate today = LocalDate.now();
                if (expired) {
                    predicates.add(criteriaBuilder.and(
                            criteriaBuilder.isNotNull(root.get("endDate")),
                            criteriaBuilder.lessThan(root.get("endDate"), today)
                    ));
                } else {
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.isNull(root.get("endDate")),
                            criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), today)
                    ));
                }
            }

            // 정렬 설정
            if (query != null) {
                LocalDate today = LocalDate.now();

                // 종료일 우선순위 계산
                Expression<Integer> expiredPriority = criteriaBuilder.<Integer>selectCase()
                        .when(
                                criteriaBuilder.or(
                                        criteriaBuilder.isNull(root.get("endDate")),
                                        criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), today)
                                ),
                                criteriaBuilder.literal(0)
                        )
                        .otherwise(criteriaBuilder.literal(1));

                List<Order> orders = new ArrayList<>();
                orders.add(criteriaBuilder.asc(expiredPriority));

                if (sortField != null && !sortField.isEmpty()) {
                    orders.add(criteriaBuilder.desc(root.get(sortField)));
                }

                query.orderBy(orders);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
