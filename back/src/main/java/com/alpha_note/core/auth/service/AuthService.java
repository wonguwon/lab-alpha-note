package com.alpha_note.core.auth.service;

import com.alpha_note.core.auth.dto.AuthResponse;
import com.alpha_note.core.auth.dto.LoginRequest;
import com.alpha_note.core.auth.dto.RegisterRequest;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.Role;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import com.alpha_note.core.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailVerificationService emailVerificationService;

    public AuthResponse register(RegisterRequest request) {
        // 이메일 인증 확인
        if (!emailVerificationService.isVerified(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        // 이메일 중복 체크 (삭제된 계정 포함)
        if (userRepository.existsByEmail(request.getEmail())) {
            // 삭제된 계정인지 확인
            User existingUser = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new CustomException(ErrorCode.DUPLICATE_EMAIL));

            if (existingUser.isDeleted()) {
                // 복구 가능 기간(60일 이내)인지 확인
                if (existingUser.canBeRecovered()) {
                    throw new CustomException(ErrorCode.ACCOUNT_IN_GRACE_PERIOD);
                }
                // 60일 경과: 완전 삭제하고 재가입 허용
                userRepository.delete(existingUser);
            } else {
                // 활성 계정인 경우 중복 에러
                throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
            }
        }

        // 닉네임 중복 체크 (닉네임이 제공된 경우에만, 활성 계정만)
        if (request.getNickname() != null && !request.getNickname().trim().isEmpty()) {
            if (userRepository.existsByNicknameAndIsDeletedFalse(request.getNickname())) {
                throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
            }
            // 삭제된 계정의 닉네임도 체크 (복구 가능 기간 중)
            User deletedUserWithNickname = userRepository.findByNickname(request.getNickname()).orElse(null);
            if (deletedUserWithNickname != null && deletedUserWithNickname.isDeleted() && deletedUserWithNickname.canBeRecovered()) {
                throw new CustomException(ErrorCode.ACCOUNT_IN_GRACE_PERIOD);
            }
        }

        // 사용자 생성
        User user = User.builder()
                .nickname(request.getNickname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .emailSubscribed(request.isEmailSubscribed())
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .nickname(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            // 인증 (email로 로그인)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();

            // JWT 토큰 생성
            String token = jwtUtil.generateToken(user);

            return AuthResponse.builder()
                    .token(token)
                    .nickname(user.getNickname())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();

        } catch (BadCredentialsException e) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    /**
     * 이메일 사용 가능 여부 확인
     *
     * @param email 확인할 이메일
     * @return 사용 가능 여부
     */
    public boolean checkEmailAvailability(String email) {
        return !userRepository.existsByEmail(email);
    }
}
