package com.alpha_note.core.habit.enums;

import lombok.Getter;

/**
 * 습관 정렬 타입
 */
@Getter
public enum HabitSortType {
    /**
     * 최신순 (생성일 기준)
     */
    LATEST("createdAt"),

    /**
     * 현재 연속일 순 (내림차순)
     */
    CURRENT_STREAK("currentStreak"),

    /**
     * 최장 연속일 순 (내림차순)
     */
    LONGEST_STREAK("longestStreak");

    private final String fieldName;

    HabitSortType(String fieldName) {
        this.fieldName = fieldName;
    }
}
