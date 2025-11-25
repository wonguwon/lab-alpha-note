package com.alpha_note.core.habit.service;

import com.alpha_note.core.habit.entity.Habit;
import com.alpha_note.core.habit.repository.HabitRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HabitStreakService {

    private final HabitRecordRepository habitRecordRepository;

    /**
     * Streak 계산 및 업데이트
     *
     * @param habit 습관 엔터티
     * @return 현재 연속일
     */
    @Transactional
    public int calculateAndUpdateStreak(Habit habit) {
        // 1. 기록된 날짜 목록 조회 (최신순, 중복 제거)
        List<LocalDate> recordDates = habitRecordRepository
                .findDistinctRecordDatesByHabitIdOrderByRecordDateDesc(habit.getId());

        if (recordDates.isEmpty()) {
            habit.updateStreak(0);
            return 0;
        }

        // 2. 현재 Streak 계산
        int currentStreak = 0;
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // 오늘 또는 어제 기록이 있어야 Streak 유지
        LocalDate latestDate = recordDates.get(0);
        if (latestDate.equals(today) || latestDate.equals(yesterday)) {
            currentStreak = 1;
            LocalDate expectedDate = latestDate.minusDays(1);

            // 연속된 날짜 카운트
            for (int i = 1; i < recordDates.size(); i++) {
                LocalDate currentDate = recordDates.get(i);
                if (currentDate.equals(expectedDate)) {
                    currentStreak++;
                    expectedDate = expectedDate.minusDays(1);
                } else {
                    break;  // 연속 끊김
                }
            }
        }

        // 3. Habit 엔터티 업데이트
        habit.updateStreak(currentStreak);

        return currentStreak;
    }

    /**
     * 특정 날짜까지의 Streak 계산 (캐싱하지 않음)
     * 통계 조회용
     */
    public int calculateStreakUntilDate(Long habitId, LocalDate targetDate) {
        List<LocalDate> recordDates = habitRecordRepository
                .findDistinctRecordDatesByHabitIdOrderByRecordDateDesc(habitId);

        if (recordDates.isEmpty()) {
            return 0;
        }

        int streak = 0;
        LocalDate latestDate = recordDates.get(0);

        // targetDate 이후 기록은 무시
        if (latestDate.isAfter(targetDate)) {
            // targetDate 이전의 기록 중 가장 최근 기록 찾기
            latestDate = recordDates.stream()
                    .filter(date -> !date.isAfter(targetDate))
                    .findFirst()
                    .orElse(null);

            if (latestDate == null) {
                return 0;
            }
        }

        // targetDate 또는 그 전날에 기록이 있어야 streak 시작
        if (latestDate.equals(targetDate) || latestDate.equals(targetDate.minusDays(1))) {
            streak = 1;
            LocalDate expectedDate = latestDate.minusDays(1);

            for (LocalDate date : recordDates) {
                if (date.equals(latestDate)) {
                    continue;
                }
                if (date.isAfter(targetDate)) {
                    continue;
                }
                if (date.equals(expectedDate)) {
                    streak++;
                    expectedDate = expectedDate.minusDays(1);
                } else if (date.isBefore(expectedDate)) {
                    break;
                }
            }
        }

        return streak;
    }
}
