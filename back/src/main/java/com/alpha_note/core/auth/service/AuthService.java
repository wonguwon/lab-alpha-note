package com.alpha_note.core.auth.service;

import com.alpha_note.core.auth.dto.AuthResponse;
import com.alpha_note.core.auth.dto.LoginRequest;
import com.alpha_note.core.auth.dto.PasswordResetConfirmRequest;
import com.alpha_note.core.auth.dto.PasswordResetRequest;
import com.alpha_note.core.auth.dto.RegisterRequest;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.Role;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import com.alpha_note.core.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    @Value("${app.oauth2.authorized-redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String oauth2RedirectUri;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 이메일 인증 확인
        if (!emailVerificationService.isVerified(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        // 활성 계정 중복 체크
        Optional<User> activeUser = userRepository.findByEmailAndIsDeletedFalse(request.getEmail());
        if (activeUser.isPresent()) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 삭제된 계정 처리 (복구 가능 기간 체크)
        var deletedUsers = userRepository.findAllByEmailAndIsDeletedTrue(request.getEmail());
        for (User deletedUser : deletedUsers) {
            if (deletedUser.canBeRecovered()) {
                // 복구 가능 기간(60일 이내)인 계정이 있으면 에러
                throw new CustomException(ErrorCode.ACCOUNT_IN_GRACE_PERIOD);
            }
            // 60일 경과: 완전 삭제하고 재가입 허용
            userRepository.delete(deletedUser);
        }

        // 닉네임 중복 체크 (닉네임이 제공된 경우에만)
        if (request.getNickname() != null && !request.getNickname().trim().isEmpty()) {
            // 활성 계정 닉네임 중복 체크
            if (userRepository.existsByNicknameAndIsDeletedFalse(request.getNickname())) {
                throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
            }
            // 삭제된 계정의 닉네임도 체크 (복구 가능 기간 중)
            var deletedUsersWithNickname = userRepository.findAllByNicknameAndIsDeletedTrue(request.getNickname());
            for (User deletedUser : deletedUsersWithNickname) {
                if (deletedUser.canBeRecovered()) {
                    throw new CustomException(ErrorCode.ACCOUNT_IN_GRACE_PERIOD);
                }
            }
        }

        // 비밀번호에 이메일 일부 포함 검증
        validatePasswordNotContainsEmail(request.getPassword(), request.getEmail());

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

        // 회원가입 성공 시 인증 레코드 삭제 (더 이상 필요 없음)
        emailVerificationService.deleteByEmail(request.getEmail());

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

    /**
     * 비밀번호 찾기 요청 (재설정 링크 발송)
     *
     * @param request 비밀번호 찾기 요청 (이메일)
     */
    @Transactional
    public void requestPasswordReset(PasswordResetRequest request) {
        // 이메일로 계정 조회
        Optional<User> userOpt = userRepository.findByEmailAndIsDeletedFalse(request.getEmail());
        
        if (userOpt.isEmpty()) {
            log.warn("Password reset requested for non-existent email: {}", request.getEmail());
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        log.warn("userOpt: {}", userOpt);
        User user = userOpt.get();
        log.warn("user: {}", user);

        // LOCAL 계정인지 확인
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new CustomException(ErrorCode.SOCIAL_ACCOUNT_PASSWORD_RESET);
        }

        // 비밀번호 재설정 토큰 생성
        String resetToken = jwtUtil.generatePasswordResetToken(user);

        // 재설정 링크 생성 (OAuth2 redirect URI에서 경로 제거하여 base URL 추출)
        String baseUrl = oauth2RedirectUri.replace("/oauth2/redirect", "");
        String resetLink = baseUrl + "/reset-password?token=" + resetToken;

        // 이메일 발송
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        log.info("Password reset link sent to: {}", user.getEmail());
    }

    /**
     * 비밀번호 재설정
     *
     * @param request 비밀번호 재설정 요청 (토큰, 새 비밀번호, 비밀번호 확인)
     */
    @Transactional
    public void resetPassword(PasswordResetConfirmRequest request) {
        // 비밀번호 일치 확인
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // 토큰 검증
        if (!jwtUtil.validatePasswordResetToken(request.getToken())) {
            if (jwtUtil.isPasswordResetToken(request.getToken())) {
                throw new CustomException(ErrorCode.EXPIRED_PASSWORD_RESET_TOKEN);
            }
            throw new CustomException(ErrorCode.INVALID_PASSWORD_RESET_TOKEN);
        }

        // userId 추출
        Long userId = jwtUtil.extractUserId(request.getToken());
        if (userId == null) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD_RESET_TOKEN);
        }

        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 토큰이 이미 사용되었는지 확인 (lastPasswordResetAt이 토큰 발급 시간 이후인지)
        Date tokenIssuedAt = jwtUtil.extractIssuedAt(request.getToken());
        if (user.getLastPasswordResetAt() != null &&
                tokenIssuedAt.toInstant().isBefore(user.getLastPasswordResetAt())) {
            log.warn("Password reset token already used for user: {}", user.getEmail());
            throw new CustomException(ErrorCode.PASSWORD_RESET_TOKEN_ALREADY_USED);
        }

        // 비밀번호 검증
        validatePasswordNotContainsEmail(request.getNewPassword(), user.getEmail());

        // 비밀번호 업데이트 (lastPasswordResetAt도 자동 업데이트됨)
        user.updatePassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password reset completed for user: {}", user.getEmail());
    }

    /**
     * 비밀번호에 이메일 일부 포함 여부 검증
     * 프론트엔드와 동일한 로직 적용:
     * - 이메일 아이디(@앞부분)가 3자 이상인 경우
     * - 이메일 아이디의 앞 5자 이내가 비밀번호에 포함되어 있으면 에러
     *
     * @param password 비밀번호
     * @param email 이메일
     */
    private void validatePasswordNotContainsEmail(String password, String email) {
        if (email == null || password == null) {
            return;
        }

        // 이메일에서 @ 앞부분 추출
        String emailId = email.split("@")[0].toLowerCase();
        String passwordLower = password.toLowerCase();

        // 이메일 아이디가 3자 이상이고, 비밀번호에 일부가 포함되어 있는지 확인
        if (emailId.length() >= 3) {
            String emailPrefix = emailId.substring(0, Math.min(emailId.length(), 5));
            if (passwordLower.contains(emailPrefix)) {
                throw new CustomException(ErrorCode.PASSWORD_CONTAINS_EMAIL);
            }
        }
    }
}
