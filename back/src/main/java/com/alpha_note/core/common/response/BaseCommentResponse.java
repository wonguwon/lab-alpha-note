package com.alpha_note.core.common.response;


import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class BaseCommentResponse {
    private Long id;
    private Long userId;
    private String content;
    private Instant createdAt;
    private Instant updatedAt;
}
