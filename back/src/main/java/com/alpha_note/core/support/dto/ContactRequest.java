package com.alpha_note.core.support.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 문의사항/에러 보고 요청 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {

    /**
     * 문의 유형
     */
    @NotNull(message = "문의 유형은 필수입니다.")
    private ContactType type;

    /**
     * 발신자 이메일
     */
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    /**
     * 제목
     */
    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다.")
    private String subject;

    /**
     * 내용
     */
    @NotBlank(message = "내용은 필수입니다.")
    @Size(max = 5000, message = "내용은 5000자를 초과할 수 없습니다.")
    private String content;

    /**
     * 문의 유형 enum
     */
    public enum ContactType {
        INQUIRY("일반 문의"),
        ERROR("에러 보고"),
        FEATURE("기능 제안"),
        COLLABORATION("협업 제안"),
        OTHER("기타");

        private final String description;

        ContactType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
