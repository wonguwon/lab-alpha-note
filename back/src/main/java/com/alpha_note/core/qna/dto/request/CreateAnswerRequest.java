package com.alpha_note.core.qna.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAnswerRequest {

    @NotBlank(message = "답변 내용은 필수입니다.")
    private String content;
}
