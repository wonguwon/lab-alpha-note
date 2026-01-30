package com.alpha_note.core.qna.entity;

import com.alpha_note.core.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * 질문 추천 엔티티
 * - 사용자당 질문 1개에 1표만 가능 (UP only)
 */
@Entity
@Table(name = "question_votes",
       uniqueConstraints = @UniqueConstraint(name = "uk_question_user_vote", columnNames = {"question_id", "user_id"}),
       indexes = {
           @Index(name = "idx_user_id", columnList = "user_id")
       })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class QuestionVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question questionEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 편의 메서드 (하위 호환성) ==========

    public Long getQuestionId() {
        return questionEntity != null ? questionEntity.getId() : null;
    }

    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public Question getQuestion() {
        return questionEntity;
    }
}
