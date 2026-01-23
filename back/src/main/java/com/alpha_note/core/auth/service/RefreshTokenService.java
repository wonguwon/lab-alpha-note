package com.alpha_note.core.auth.service;

import com.alpha_note.core.auth.entity.RefreshToken;
import com.alpha_note.core.auth.repository.RefreshTokenRepository;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.security.jwt.JwtUtil;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

/**
 * 리프레시 토큰 관리 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-expiration:604800000}") // 7 days
    private Long refreshExpiration;

    /**
     * Repository 접근을 위한 getter (AuthController에서 사용)
     */
    public RefreshTokenRepository getRefreshTokenRepository() {
        return refreshTokenRepository;
    }

    /**
     * 리프레시 토큰 생성 및 저장
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // 기존 리프레시 토큰 삭제 (토큰 로테이션)
        refreshTokenRepository.deleteByUserId(user.getId());

        // 새 리프레시 토큰 생성
        String tokenValue = jwtUtil.generateRefreshToken(user);
        Instant expiresAt = Instant.now().plusMillis(refreshExpiration);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(tokenValue)
                .expiresAt(expiresAt)
                .isRevoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * 리프레시 토큰 검증 및 조회
     */
    @Transactional
    public RefreshToken validateRefreshToken(String token) {
        // JWT 토큰 검증
        if (!jwtUtil.validateRefreshToken(token)) {
            if (jwtUtil.isRefreshToken(token)) {
                throw new CustomException(ErrorCode.EXPIRED_REFRESH_TOKEN);
            }
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // DB에서 토큰 조회
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        RefreshToken refreshToken = tokenOpt.get();

        // 토큰 유효성 확인 (만료, 무효화 여부)
        if (!refreshToken.isValid()) {
            if (refreshToken.isExpired()) {
                throw new CustomException(ErrorCode.EXPIRED_REFRESH_TOKEN);
            }
            throw new CustomException(ErrorCode.REVOKED_REFRESH_TOKEN);
        }

        // 토큰 재사용 감지 (보안 강화)
        // 같은 토큰이 두 번 사용되면 모든 토큰 무효화
        if (refreshToken.getLastUsedAt() != null) {
            log.warn("Refresh token reuse detected for user: {}", refreshToken.getUser().getId());
            revokeAllUserRefreshTokens(refreshToken.getUser().getId());
            throw new CustomException(ErrorCode.REFRESH_TOKEN_REUSE_DETECTED);
        }

        // 토큰 사용 표시
        refreshToken.markAsUsed();
        refreshTokenRepository.save(refreshToken);

        return refreshToken;
    }

    /**
     * 리프레시 토큰 무효화
     */
    @Transactional
    public void revokeRefreshToken(String token) {
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(token);
        if (tokenOpt.isPresent()) {
            RefreshToken refreshToken = tokenOpt.get();
            refreshToken.revoke();
            refreshTokenRepository.save(refreshToken);
            log.info("Refresh token revoked for user: {}", refreshToken.getUser().getId());
        }
    }

    /**
     * 사용자의 모든 리프레시 토큰 무효화
     */
    @Transactional
    public void revokeAllUserRefreshTokens(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
        log.info("All refresh tokens revoked for user: {}", userId);
    }

    /**
     * 만료된 토큰 정리
     */
    @Transactional
    public void cleanExpiredTokens() {
        Instant now = Instant.now();
        refreshTokenRepository.deleteByExpiresAtBefore(now);
        log.info("Cleaned expired refresh tokens");
    }
}

