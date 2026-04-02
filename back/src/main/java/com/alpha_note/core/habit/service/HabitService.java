package com.alpha_note.core.habit.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.habit.dto.request.CreateHabitRequest;
import com.alpha_note.core.habit.dto.request.UpdateHabitRequest;
import com.alpha_note.core.habit.dto.response.HabitResponse;
import com.alpha_note.core.habit.dto.response.HabitWithCalendarDTO;
import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.entity.HabitRecord;
import com.alpha_note.core.habit.enums.HabitSearchType;
import com.alpha_note.core.habit.enums.HabitSortType;
import com.alpha_note.core.habit.enums.HabitStatus;
import com.alpha_note.core.habit.repository.HabitRecordRepository;
import com.alpha_note.core.habit.repository.HabitRepository;
import com.alpha_note.core.habit.repository.HabitSpecification;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitRecordRepository habitRecordRepository;
    private final UserRepository userRepository;

    /**
     * 습관 생성
     */
    @Transactional
    public HabitResponse createHabit(Long userId, CreateHabitRequest request) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 습관 생성
        Habit habit = Habit.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .color(request.getColor() != null ? request.getColor() : "#10B981")
                .targetCount(request.getTargetCount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        Habit savedHabit = habitRepository.save(habit);

        return HabitResponse.from(savedHabit);
    }

    /**
     * 습관 목록 조회 (상태별 필터, 비로그인 허용)
     * @param userId null이면 모든 습관 조회, 값이 있으면 해당 사용자의 습관 조회
     */
    public Page<HabitResponse> getHabits(Long userId, HabitStatus status, Pageable pageable) {
        Page<Habit> habits;

        if (userId == null) {
            // 비로그인 또는 전체 조회: 모든 습관 조회 (DELETED 제외)
            if (status != null) {
                habits = habitRepository.findByStatus(status, pageable);
            } else {
                habits = habitRepository.findByStatusNot(HabitStatus.DELETED, pageable);
            }
        } else {
            // 특정 사용자의 습관 조회
            if (status != null) {
                habits = habitRepository.findByUser_IdAndStatus(userId, status, pageable);
            } else {
                habits = habitRepository.findByUser_IdAndStatusNot(userId, HabitStatus.DELETED, pageable);
            }
        }

        return habits.map(HabitResponse::from);
    }

    /**
     * 습관 상세 조회 (비로그인 허용)
     */
    public HabitResponse getHabit(Long habitId) {
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        return HabitResponse.from(habit);
    }

    /**
     * 습관 수정
     */
    @Transactional
    public HabitResponse updateHabit(Long habitId, Long userId, UpdateHabitRequest request) {
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        // 권한 확인
        if (!habit.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.HABIT_ACCESS_DENIED);
        }

        // 습관 수정
        habit.update(
                request.getTitle(),
                request.getDescription(),
                request.getColor(),
                request.getTargetCount(),
                request.getEndDate()
        );

        return HabitResponse.from(habit);
    }

    /**
     * 습관 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteHabit(Long habitId, Long userId) {
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        // 권한 확인
        if (!habit.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.HABIT_ACCESS_DENIED);
        }

        // Soft Delete
        habit.markAsDeleted();
    }

    /**
     * 습관 보관
     */
    @Transactional
    public HabitResponse archiveHabit(Long habitId, Long userId) {
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        // 권한 확인
        if (!habit.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.HABIT_ACCESS_DENIED);
        }

        // 이미 보관된 습관인지 확인
        if (habit.getStatus() == HabitStatus.ARCHIVED) {
            throw new CustomException(ErrorCode.HABIT_ALREADY_ARCHIVED);
        }

        habit.archive();

        return HabitResponse.from(habit);
    }

    /**
     * 습관 활성화 (보관 해제)
     */
    @Transactional
    public HabitResponse activateHabit(Long habitId, Long userId) {
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        // 권한 확인
        if (!habit.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.HABIT_ACCESS_DENIED);
        }

        // 이미 활성 상태인지 확인
        if (habit.getStatus() == HabitStatus.ACTIVE) {
            throw new CustomException(ErrorCode.HABIT_ALREADY_ACTIVE);
        }

        habit.activate();

        return HabitResponse.from(habit);
    }

    /**
     * 습관 조회 (내부용 - 권한 체크 포함)
     */
    public Habit getHabitEntity(Long habitId, Long userId) {
        Habit habit = habitRepository.findByIdAndStatusNot(habitId, HabitStatus.DELETED)
                .orElseThrow(() -> new CustomException(ErrorCode.HABIT_NOT_FOUND));

        if (!habit.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.HABIT_ACCESS_DENIED);
        }

        return habit;
    }

    /**
     * 습관 대시보드 조회 (습관 목록 + 잔디 캘린더 데이터)
     * 프론트엔드에서 한 번의 API 호출로 모든 데이터를 받을 수 있도록 최적화
     *
     * @param userId 사용자 ID (null이면 모든 습관 조회)
     * @param status 습관 상태 필터 (ACTIVE, ARCHIVED 등)
     * @param keyword 검색 키워드
     * @param searchType 검색 타입 (ALL, TITLE, AUTHOR)
     * @param sortType 정렬 타입 (LATEST, CURRENT_STREAK, LONGEST_STREAK)
     * @param expired 종료일 필터 (true: 종료일 지난 것만, false: 안 지난 것만, null: 전체)
     * @param startMonth 잔디 시작 월 (YYYY-MM 형식, null이면 현재-6개월)
     * @param endMonth 잔디 종료 월 (YYYY-MM 형식, null이면 현재월)
     * @param pageable 페이징 정보
     * @return 습관 목록 + 각 습관의 잔디 캘린더 데이터
     */
    public Page<HabitWithCalendarDTO> getHabitDashboard(
            Long userId,
            HabitStatus status,
            String keyword,
            HabitSearchType searchType,
            HabitSortType sortType,
            Boolean expired,
            String startMonth,
            String endMonth,
            Pageable pageable
    ) {
        // 1. sortType의 필드명 추출 (종료일 우선순위 다음으로 적용될 정렬)
        String sortField = (sortType != null) ? sortType.getFieldName() : "createdAt";

        // 2. Sort 없는 Pageable 생성 (Specification에서 정렬 처리)
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());

        // 3. 습관 목록 조회 (검색 또는 필터)
        Page<Habit> habitPage;
        if (keyword != null && !keyword.trim().isEmpty()) {
            // 검색 모드
            habitPage = performSearch(userId, status, keyword.trim(), searchType, expired, sortField, pageable);
        } else {
            // 일반 필터 모드
            habitPage = performFilter(userId, status, expired, sortField, pageable);
        }

        List<Habit> habits = habitPage.getContent();

        // 습관이 없으면 빈 페이지 반환
        if (habits.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        // 3. 사용자 닉네임 조회 (고유한 user IDs 추출 후 일괄 조회)
        Set<Long> userIds = habits.stream()
                .map(Habit::getUserId)
                .collect(Collectors.toSet());

        Map<Long, String> userNicknameMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(
                        user -> user.getId(),
                        user -> user.getNickname()
                ));

        // 4. 날짜 범위 계산
        LocalDate startDate = calculateStartDate(startMonth);
        LocalDate endDate = calculateEndDate(endMonth);

        // 5. 모든 습관의 기록을 한 번에 조회 (N+1 문제 해결)
        List<Long> habitIds = habits.stream()
                .map(Habit::getId)
                .collect(Collectors.toList());

        List<HabitRecord> records = habitRecordRepository
                .findByHabitEntity_IdInAndRecordDateBetweenAndIsDeletedFalse(habitIds, startDate, endDate);

        // 6. 기록을 habitId별로 그룹핑하여 캘린더 데이터 생성
        // Map<habitId, Map<recordDate, count>>
        Map<Long, Map<LocalDate, Long>> calendarDataByHabitId = records.stream()
                .collect(Collectors.groupingBy(
                        HabitRecord::getHabitId,
                        Collectors.groupingBy(
                                HabitRecord::getRecordDate,
                                Collectors.summingLong(HabitRecord::getCount)
                        )
                ));

        // 7. Habit + Calendar + User Nickname 데이터 결합
        List<HabitWithCalendarDTO> habitWithCalendarList = habits.stream()
                .map(habit -> {
                    Map<LocalDate, Long> calendar = calendarDataByHabitId.getOrDefault(
                            habit.getId(),
                            Collections.emptyMap()
                    );
                    String userNickname = userNicknameMap.getOrDefault(habit.getUserId(), "Unknown");
                    return HabitWithCalendarDTO.from(habit, calendar, userNickname);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(habitWithCalendarList, pageable, habitPage.getTotalElements());
    }

    /**
     * 시작 날짜 계산 (startMonth가 null이면 현재-6개월)
     */
    private LocalDate calculateStartDate(String startMonth) {
        if (startMonth != null && !startMonth.isEmpty()) {
            try {
                YearMonth yearMonth = YearMonth.parse(startMonth);
                return yearMonth.atDay(1);
            } catch (Exception e) {
                // 파싱 실패 시 기본값 사용
            }
        }
        // 기본값: 현재로부터 6개월 전
        return YearMonth.now().minusMonths(6).atDay(1);
    }

    /**
     * 종료 날짜 계산 (endMonth가 null이면 현재월 마지막 날)
     */
    private LocalDate calculateEndDate(String endMonth) {
        if (endMonth != null && !endMonth.isEmpty()) {
            try {
                YearMonth yearMonth = YearMonth.parse(endMonth);
                return yearMonth.atEndOfMonth();
            } catch (Exception e) {
                // 파싱 실패 시 기본값 사용
            }
        }
        // 기본값: 현재 월의 마지막 날
        return YearMonth.now().atEndOfMonth();
    }

    /**
     * 검색 수행 (종료일 우선순위 정렬 포함)
     */
    private Page<Habit> performSearch(Long userId, HabitStatus status, String keyword, HabitSearchType searchType, Boolean expired, String sortField, Pageable pageable) {
        // searchType이 null이면 ALL로 처리
        if (searchType == null) {
            searchType = HabitSearchType.ALL;
        }

        // 종료일 우선순위 정렬이 포함된 Specification 사용
        Specification<Habit> spec = HabitSpecification.withSearchAndExpiredSort(
                userId, status, keyword, searchType, expired, sortField
        );
        return habitRepository.findAll(spec, pageable);
    }

    /**
     * 일반 필터 수행 (종료일 우선순위 정렬 포함)
     */
    private Page<Habit> performFilter(Long userId, HabitStatus status, Boolean expired, String sortField, Pageable pageable) {
        // 종료일 우선순위 정렬이 포함된 Specification 사용
        Specification<Habit> spec = HabitSpecification.withFiltersAndExpiredSort(
                userId,
                status != null ? status : HabitStatus.DELETED,
                status == null, // statusNot: status가 null이면 DELETED 제외
                expired,
                sortField
        );

        return habitRepository.findAll(spec, pageable);
    }
}
