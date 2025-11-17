package com.alpha_note.core.qna.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * 질문 조회 기록 엔티티
 * - 사용자별 질문 조회 여부 추적
 * - 조회수 중복 방지에 사용
 * - Redis로 마이그레이션 가능하도록 설계됨
 */
@Entity
@Table(name = "question_views", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_viewed_at", columnList = "viewed_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class QuestionView {

    @EmbeddedId
    private QuestionViewId id;

    @Column(name = "viewed_at", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant viewedAt;

    /**
     * 정적 팩토리 메서드
     */
    public static QuestionView of(Long questionId, Long userId) {
        return QuestionView.builder()
                .id(new QuestionViewId(questionId, userId))
                .build();
    }
}
