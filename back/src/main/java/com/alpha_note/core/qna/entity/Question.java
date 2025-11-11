package com.alpha_note.core.qna.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * 질문 엔티티
 * - 사용자가 작성한 질문
 * - 답변, 댓글, 투표, 태그와 관계
 * - 이미지는 content 필드에 마크다운 형식으로 임베드
 */
@Entity
@Table(name = "questions", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_is_deleted", columnList = "is_deleted"),
        @Index(name = "idx_created_at", columnList = "created_at"),
        @Index(name = "idx_vote_count", columnList = "vote_count"),
        @Index(name = "idx_last_activity_at", columnList = "last_activity_at"),
        @Index(name = "idx_is_answered", columnList = "is_answered"),
        @Index(name = "idx_accepted_answer_id", columnList = "accepted_answer_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "vote_count", nullable = false)
    @Builder.Default
    private Integer voteCount = 0;

    @Column(name = "answer_count", nullable = false)
    @Builder.Default
    private Integer answerCount = 0;

    @Column(name = "is_answered", nullable = false)
    @Builder.Default
    private Boolean isAnswered = false;

    @Column(name = "accepted_answer_id")
    private Long acceptedAnswerId;

    @Column(name = "last_activity_at", nullable = false)
    @Builder.Default
    private Instant lastActivityAt = Instant.now();

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

    // ========== 관계 매핑 (양방향) ==========

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Answer> answers = new ArrayList<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuestionComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuestionVote> votes = new ArrayList<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuestionTag> questionTags = new ArrayList<>();

    // ========== 비즈니스 메소드 ==========

    /**
     * 조회수 증가
     */
    public void incrementViewCount() {
        this.viewCount++;
    }

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
     * 답변수 증가
     */
    public void incrementAnswerCount() {
        this.answerCount++;
        this.updateLastActivity();
    }

    /**
     * 답변수 감소
     */
    public void decrementAnswerCount() {
        if (this.answerCount > 0) {
            this.answerCount--;
        }
    }

    /**
     * 답변 채택
     * @param answerId 채택할 답변 ID
     */
    public void acceptAnswer(Long answerId) {
        this.acceptedAnswerId = answerId;
        this.isAnswered = true;
        this.updateLastActivity();
    }

    /**
     * 답변 채택 취소
     */
    public void unacceptAnswer() {
        this.acceptedAnswerId = null;
        this.isAnswered = false;
        this.updateLastActivity();
    }

    /**
     * 마지막 활동 시간 업데이트
     */
    public void updateLastActivity() {
        this.lastActivityAt = Instant.now();
    }

    /**
     * 질문 수정
     * @param title 제목
     * @param content 내용
     */
    public void update(String title, String content) {
        this.title = title;
        this.content = content;
        this.updateLastActivity();
    }

    /**
     * Soft Delete (연쇄 삭제는 Service에서 처리)
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
        return this.userId.equals(userId);
    }

    /**
     * 답변이 채택되었는지 확인
     */
    public boolean hasAcceptedAnswer() {
        return this.acceptedAnswerId != null;
    }
}
