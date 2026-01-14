package com.alpha_note.core.goal.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.goal.dto.request.CreateYearlyGoalRequest;
import com.alpha_note.core.goal.dto.request.ToggleGoalItemRequest;
import com.alpha_note.core.goal.dto.request.UpdateYearlyGoalRequest;
import com.alpha_note.core.goal.dto.response.YearlyGoalResponse;
import com.alpha_note.core.goal.entity.YearlyGoal;
import com.alpha_note.core.goal.repository.YearlyGoalRepository;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class YearlyGoalService {

    private final YearlyGoalRepository yearlyGoalRepository;
    private final UserRepository userRepository;

    /**
     * 목표 생성/업데이트 (연도별 유니크 제약조건으로 인해 같은 연도면 업데이트)
     */
    @Transactional
    public YearlyGoalResponse createYearlyGoal(Long userId, CreateYearlyGoalRequest request) {
        // 사용자 존재 확인
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 기존 목표 조회 (있으면 업데이트, 없으면 생성)
        YearlyGoal yearlyGoal = yearlyGoalRepository.findByUserIdAndYear(userId, request.getYear())
                .orElse(YearlyGoal.builder()
                        .userId(userId)
                        .year(request.getYear())
                        .goals(request.getGoals())
                        .build());

        yearlyGoal.updateGoals(request.getGoals());
        YearlyGoal savedGoal = yearlyGoalRepository.save(yearlyGoal);

        log.info("Yearly goal saved - userId: {}, year: {}, goalId: {}", userId, request.getYear(), savedGoal.getId());
        return YearlyGoalResponse.from(savedGoal);
    }

    /**
     * 목표 수정
     */
    @Transactional
    public YearlyGoalResponse updateYearlyGoal(Long userId, Long goalId, UpdateYearlyGoalRequest request) {
        YearlyGoal yearlyGoal = yearlyGoalRepository.findById(goalId)
                .orElseThrow(() -> new CustomException(ErrorCode.YEARLY_GOAL_NOT_FOUND));

        // 권한 확인
        if (!yearlyGoal.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.YEARLY_GOAL_ACCESS_DENIED);
        }

        yearlyGoal.updateGoals(request.getGoals());
        YearlyGoal savedGoal = yearlyGoalRepository.save(yearlyGoal);

        log.info("Yearly goal updated - userId: {}, goalId: {}", userId, goalId);
        return YearlyGoalResponse.from(savedGoal);
    }

    /**
     * 목표 달성 여부 토글
     */
    @Transactional
    public YearlyGoalResponse toggleGoalItem(Long userId, Long goalId, ToggleGoalItemRequest request) {
        YearlyGoal yearlyGoal = yearlyGoalRepository.findById(goalId)
                .orElseThrow(() -> new CustomException(ErrorCode.YEARLY_GOAL_NOT_FOUND));

        // 권한 확인
        if (!yearlyGoal.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.YEARLY_GOAL_ACCESS_DENIED);
        }

        // 인덱스 유효성 확인
        if (request.getGoalIndex() < 0 || request.getGoalIndex() >= yearlyGoal.getGoals().size()) {
            throw new CustomException(ErrorCode.INVALID_GOAL_INDEX);
        }

        yearlyGoal.toggleGoalItem(request.getGoalIndex());
        YearlyGoal savedGoal = yearlyGoalRepository.save(yearlyGoal);

        log.info("Goal item toggled - userId: {}, goalId: {}, index: {}", userId, goalId, request.getGoalIndex());
        return YearlyGoalResponse.from(savedGoal);
    }

    /**
     * 목표 삭제
     */
    @Transactional
    public void deleteYearlyGoal(Long userId, Long goalId) {
        YearlyGoal yearlyGoal = yearlyGoalRepository.findById(goalId)
                .orElseThrow(() -> new CustomException(ErrorCode.YEARLY_GOAL_NOT_FOUND));

        // 권한 확인
        if (!yearlyGoal.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.YEARLY_GOAL_ACCESS_DENIED);
        }

        yearlyGoalRepository.delete(yearlyGoal);
        log.info("Yearly goal deleted - userId: {}, goalId: {}", userId, goalId);
    }

    /**
     * 특정 연도 목표 조회
     */
    public YearlyGoalResponse getYearlyGoal(Long userId, Integer year) {
        YearlyGoal yearlyGoal = yearlyGoalRepository.findByUserIdAndYear(userId, year)
                .orElseThrow(() -> new CustomException(ErrorCode.YEARLY_GOAL_NOT_FOUND));

        // 권한 확인
        if (!yearlyGoal.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.YEARLY_GOAL_ACCESS_DENIED);
        }

        return YearlyGoalResponse.from(yearlyGoal);
    }

    /**
     * 사용자의 모든 연도 목표 조회
     */
    public List<YearlyGoalResponse> getAllYearlyGoals(Long userId) {
        List<YearlyGoal> yearlyGoals = yearlyGoalRepository.findAllByUserIdOrderByYearDesc(userId);
        return yearlyGoals.stream()
                .map(YearlyGoalResponse::from)
                .collect(Collectors.toList());
    }
}

