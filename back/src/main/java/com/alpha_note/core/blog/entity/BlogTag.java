package com.alpha_note.core.blog.entity;

import com.alpha_note.core.qna.entity.Tag;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "blog_tags",
        uniqueConstraints = @UniqueConstraint(name = "uk_blog_tag", columnNames = {"blog_id", "tag_id"}),
        indexes = {
                @Index(name = "idx_tag_id", columnList = "tag_id")
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BlogTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blog_id", nullable = false)
    private Long blogId;

    @Column(name = "tag_id", nullable = false)
    private Long tagId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // ========== 관계 매핑 ==========

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", insertable = false, updatable = false)
    private Blog blog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", insertable = false, updatable = false)
    private Tag tag;


}
