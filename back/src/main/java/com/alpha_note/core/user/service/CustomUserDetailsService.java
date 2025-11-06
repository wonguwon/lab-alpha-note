package com.alpha_note.core.user.service;

import com.alpha_note.core.common.exception.UserAccountDeletedException;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username 파라미터에는 실제로 email이 전달됨 (로그인 시 email 사용)
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        // 탈퇴한 회원인 경우 UserAccountDeletedException 발생
        // GlobalExceptionHandler에서 복구 토큰 발급 처리
        if (user.isDeleted()) {
            throw new UserAccountDeletedException(user);
        }

        return user;
    }
}
