package com.alpha_note.core.blog.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BlogVisibility {
    PUBLIC("공개"),
    PRIVATE("비공개");

    private final String description;
}
