package com.alpha_note.core.security.oauth2;

import com.alpha_note.core.user.entity.User;
import lombok.Getter;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

/**
 * OAuth2 인증 시 탈퇴 신청된 회원인 경우 발생하는 예외
 */
@Getter
public class OAuth2UserDeletedException extends OAuth2AuthenticationException {
    private final User user;

    public OAuth2UserDeletedException(User user, String errorCode, String message) {
        super(new OAuth2Error(errorCode), message);
        this.user = user;
    }

    public OAuth2UserDeletedException(User user, String message) {
        this(user, "user_account_deleted", message);
    }
}
