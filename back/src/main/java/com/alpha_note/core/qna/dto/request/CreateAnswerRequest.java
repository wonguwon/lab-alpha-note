package com.alpha_note.core.qna.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateAnswerRequest {

    @NotBlank(message = "답변 내용은 필수입니다.")
    private String content;

    private List<Long> attachmentIds; // 첨부파일 ID 목록
}
