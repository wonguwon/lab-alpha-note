package com.alpha_note.core.common.exception;

import com.alpha_note.core.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.AuthenticationException;

/**
 * 탈퇴한 회원 계정 예외
 * 복구 토큰 발급을 위해 User 정보를 포함
 */
@Getter
public class UserAccountDeletedException extends AuthenticationException {
    private final User user;

    public UserAccountDeletedException(User user) {
        super("User account has been deleted");
        this.user = user;
    }
}
