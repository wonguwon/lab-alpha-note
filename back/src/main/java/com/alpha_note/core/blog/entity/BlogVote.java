package com.alpha_note.core.blog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "blog_votes",
        uniqueConstraints = @UniqueConstraint(name = "uk_blog_user_vote", columnNames = {"blog_id", "user_id"}),
        indexes = {
                @Index(name = "idx_user_id", columnList = "user_id")
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BlogVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blog_id", nullable = false)
    private Long blogId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 관계 매핑 ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", insertable = false, updatable = false)
    private Blog blog;

}
