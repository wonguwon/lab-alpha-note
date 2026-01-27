package com.alpha_note.core.growthlog.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GrowthLogVisibility {
    PUBLIC("공개"),
    PRIVATE("비공개");

    private final String description;
}
