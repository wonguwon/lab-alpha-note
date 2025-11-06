package com.alpha_note.core.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * 비밀번호 검증 어노테이션
 *
 * 검증 규칙:
 * 1. 8~20자 사이
 * 2. 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합
 * 3. 동일 문자 3회 이상 반복 금지 (예: aaa, 111)
 * 4. 공백 문자 불가
 */
@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {

    String message() default "비밀번호는 8~20자의 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합이어야 하며, 동일 문자 3회 이상 반복 및 공백은 불가합니다.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
