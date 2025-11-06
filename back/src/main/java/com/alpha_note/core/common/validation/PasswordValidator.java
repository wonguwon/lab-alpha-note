package com.alpha_note.core.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

/**
 * 비밀번호 검증기
 *
 * 프론트엔드와 동일한 검증 규칙 적용:
 * 1. 8~20자 사이
 * 2. 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합
 * 3. 동일 문자 3회 이상 반복 금지 (예: aaa, 111)
 * 4. 공백 문자 불가
 */
public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    // 정규식 패턴
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern NUMBER_PATTERN = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL_PATTERN = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]");
    private static final Pattern REPEAT_PATTERN = Pattern.compile("(.)\\1{2,}"); // 동일 문자 3회 이상 반복
    private static final Pattern SPACE_PATTERN = Pattern.compile("\\s"); // 공백 문자

    @Override
    public void initialize(ValidPassword constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return false;
        }

        // 기본 메시지 비활성화
        context.disableDefaultConstraintViolation();

        // 1. 길이 검증 (8~20자)
        if (password.length() < 8 || password.length() > 20) {
            context.buildConstraintViolationWithTemplate("비밀번호는 8~20자 사이여야 합니다.")
                    .addConstraintViolation();
            return false;
        }

        // 2. 복잡도 검증 (영문 대소문자, 숫자, 특수문자 중 3가지 이상)
        int complexity = 0;
        if (LOWERCASE_PATTERN.matcher(password).find()) complexity++;
        if (UPPERCASE_PATTERN.matcher(password).find()) complexity++;
        if (NUMBER_PATTERN.matcher(password).find()) complexity++;
        if (SPECIAL_PATTERN.matcher(password).find()) complexity++;

        if (complexity < 3) {
            context.buildConstraintViolationWithTemplate("비밀번호는 영문 대소문자, 숫자, 특수문자 중 3가지 이상을 조합해야 합니다.")
                    .addConstraintViolation();
            return false;
        }

        // 3. 동일 문자 3회 이상 반복 금지
        if (REPEAT_PATTERN.matcher(password).find()) {
            context.buildConstraintViolationWithTemplate("비밀번호에 동일 문자를 3회 이상 반복할 수 없습니다. (예: aaa, 111)")
                    .addConstraintViolation();
            return false;
        }

        // 4. 공백 문자 불가
        if (SPACE_PATTERN.matcher(password).find()) {
            context.buildConstraintViolationWithTemplate("비밀번호에 공백 문자를 포함할 수 없습니다.")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
