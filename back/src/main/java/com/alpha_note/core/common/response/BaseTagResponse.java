package com.alpha_note.core.common.response;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class BaseTagResponse {
    private Long id;
    private String name;
    private String description;
    private Integer useCount;
    private Instant createdAt;
}
