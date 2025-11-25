package com.alpha_note.core.habit.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum HabitStatus {
    ACTIVE("활성"),
    ARCHIVED("보관됨"),
    DELETED("삭제됨");

    private final String description;
}
