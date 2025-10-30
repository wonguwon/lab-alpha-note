package com.alpha_note.core.storage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresignedUrlResponse {

    private String uploadUrl;
    private String fileUrl;
    private String key;
    private Long expiresIn;
}
