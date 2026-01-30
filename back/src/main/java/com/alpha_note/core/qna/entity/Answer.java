package com.alpha_note.core.qna.entity;

import com.alpha_note.core.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * 답변 엔티티
 * - 질문에 대한 답변
 * - 댓글, 투표, 첨부파일과 관계
 */
@Entity
@Table(name = "answers", indexes = {
        @Index(name = "idx_question_id", columnList = "question_id"),
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_is_deleted", columnList = "is_deleted"),
        @Index(name = "idx_is_accepted", columnList = "is_accepted"),
        @Index(name = "idx_vote_count", columnList = "vote_count"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question questionEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "vote_count", nullable = false)
    @Builder.Default
    private Integer voteCount = 0;

    @Column(name = "is_accepted", nullable = false)
    @Builder.Default
    private Boolean isAccepted = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Instant deletedAt;

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

    @OneToMany(mappedBy = "answerEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AnswerComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "answerEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AnswerVote> votes = new ArrayList<>();

    // ========== 비즈니스 메소드 ==========

    /**
     * 투표수 증가
     */
    public void incrementVoteCount() {
        this.voteCount++;
    }

    /**
     * 투표수 감소
     */
    public void decrementVoteCount() {
        if (this.voteCount > 0) {
            this.voteCount--;
        }
    }

    /**
     * 채택됨 표시
     */
    public void markAsAccepted() {
        this.isAccepted = true;
    }

    /**
     * 채택 취소
     */
    public void unmarkAsAccepted() {
        this.isAccepted = false;
    }

    /**
     * 답변 수정
     * @param content 내용
     */
    public void updateContent(String content) {
        this.content = content;
    }

    /**
     * Soft Delete
     */
    public void markAsDeleted() {
        this.isDeleted = true;
        this.deletedAt = Instant.now();
    }

    /**
     * 복구
     */
    public void restore() {
        this.isDeleted = false;
        this.deletedAt = null;
    }

    /**
     * 작성자 확인
     */
    public boolean isOwnedBy(Long userId) {
        return this.user != null && this.user.getId().equals(userId);
    }
}
