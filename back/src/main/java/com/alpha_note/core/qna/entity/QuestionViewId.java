package com.alpha_note.core.qna.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * QuestionView 복합키
 * - questionId + userId
 */
@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class QuestionViewId implements Serializable {

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "user_id")
    private Long userId;
}
