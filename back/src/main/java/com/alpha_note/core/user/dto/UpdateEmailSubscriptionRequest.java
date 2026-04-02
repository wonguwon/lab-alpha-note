package com.alpha_note.core.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateEmailSubscriptionRequest {
    @NotNull(message = "이메일 수신동의 여부는 필수입니다.")
    private Boolean emailSubscribed;
}
