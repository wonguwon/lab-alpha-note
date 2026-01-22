package com.alpha_note.core.notification.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 알림 타입 Enum
 */
@Getter
@RequiredArgsConstructor
public enum NotificationType {
    // Q&A 관련 알림
    NEW_ANSWER("새 답변", "질문에 새로운 답변이 작성되었습니다."),
    NEW_QUESTION_COMMENT("새 댓글", "질문에 새로운 댓글이 작성되었습니다."),
    NEW_ANSWER_COMMENT("새 댓글", "답변에 새로운 댓글이 작성되었습니다."),
    ANSWER_ACCEPTED("답변 채택", "답변이 채택되었습니다."),
    
    // 습관 관련 알림 (추후 확장)
    HABIT_REMINDER("습관 리마인더", "습관을 완료하지 않았습니다.");

    private final String title;
    private final String defaultMessage;
}

