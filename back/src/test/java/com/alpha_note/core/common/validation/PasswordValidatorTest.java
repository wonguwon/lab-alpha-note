package com.alpha_note.core.common.validation;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@DisplayName("PasswordValidator 테스트")
class PasswordValidatorTest {

    private PasswordValidator validator;

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new PasswordValidator();
        
        // Mock 설정
        when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        when(builder.addConstraintViolation()).thenReturn(context);
    }

    @Test
    @DisplayName("유효한 비밀번호 - 영문 대소문자 + 숫자 + 특수문자")
    void validPassword_AllTypes() {
        // given
        String password = "Test1234!@";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("유효한 비밀번호 - 영문 소문자 + 숫자 + 특수문자")
    void validPassword_LowerNumberSpecial() {
        // given
        String password = "test1234!@";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("유효한 비밀번호 - 영문 대문자 + 숫자 + 특수문자")
    void validPassword_UpperNumberSpecial() {
        // given
        String password = "TEST1234!@";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("유효한 비밀번호 - 영문 대소문자 + 숫자")
    void validPassword_UpperLowerNumber() {
        // given
        String password = "Test12345678";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("무효한 비밀번호 - null")
    void invalidPassword_Null() {
        // when
        boolean isValid = validator.isValid(null, context);

        // then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("무효한 비밀번호 - 너무 짧음 (7자)")
    void invalidPassword_TooShort() {
        // given
        String password = "Test1!";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("무효한 비밀번호 - 너무 김 (21자)")
    void invalidPassword_TooLong() {
        // given
        String password = "Test1234!@Test1234!@1";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("무효한 비밀번호 - 복잡도 부족 (영문 소문자 + 숫자만)")
    void invalidPassword_LowComplexity() {
        // given
        String password = "test12345678";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("무효한 비밀번호 - 동일 문자 3회 반복")
    void invalidPassword_RepeatedCharacters() {
        // given
        String password = "Test111!@";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("무효한 비밀번호 - 공백 포함")
    void invalidPassword_WithSpace() {
        // given
        String password = "Test 1234!@";

        // when
        boolean isValid = validator.isValid(password, context);

        // then
        assertThat(isValid).isFalse();
    }
}

