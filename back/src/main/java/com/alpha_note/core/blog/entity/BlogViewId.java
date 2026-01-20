package com.alpha_note.core.blog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * BlogView 복합키
 * - blogId + userId
 */
@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BlogViewId implements Serializable {

    @Column(name = "blog_id")
    private Long blogId;

    @Column(name = "user_id")
    private Long userId;
}
