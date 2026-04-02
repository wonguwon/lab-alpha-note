package com.alpha_note.core.qna.entity;

import com.alpha_note.core.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * 답변 추천 엔티티
 * - 사용자당 답변 1개에 1표만 가능 (UP only)
 */
@Entity
@Table(name = "answer_votes",
       uniqueConstraints = @UniqueConstraint(name = "uk_answer_user_vote", columnNames = {"answer_id", "user_id"}),
       indexes = {
           @Index(name = "idx_user_id", columnList = "user_id")
       })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AnswerVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answerEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 편의 메서드 (하위 호환성) ==========

    public Long getAnswerId() {
        return answerEntity != null ? answerEntity.getId() : null;
    }

    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public Answer getAnswer() {
        return answerEntity;
    }
}
