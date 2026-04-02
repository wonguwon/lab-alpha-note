package com.alpha_note.core.qna.enums;

/**
 * 질문 카테고리
 * - TECH: 기술 관련 질문
 * - CAREER: 커리어 관련 질문
 * - ETC: 기타 질문
 */
public enum QuestionCategory {
    TECH("기술"),
    CAREER("커리어"),
    ETC("기타");

    private final String displayName;

    QuestionCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
