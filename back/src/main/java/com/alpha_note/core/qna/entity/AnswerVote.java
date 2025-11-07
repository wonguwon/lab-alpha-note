package com.alpha_note.core.qna.entity;

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

    @Column(name = "answer_id", nullable = false)
    private Long answerId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 관계 매핑 ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", insertable = false, updatable = false)
    private Answer answer;
}
