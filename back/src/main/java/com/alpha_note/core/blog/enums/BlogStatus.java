package com.alpha_note.core.blog.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BlogStatus {
    DRAFT("임시저장"),
    PUBLISHED("발행됨");

    private final String description;
}
