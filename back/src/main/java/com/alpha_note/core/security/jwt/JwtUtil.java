package com.alpha_note.core.security.jwt;

import com.alpha_note.core.user.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT 토큰 생성 및 검증 유틸리티
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 hours
    private Long expiration;

    @Value("${jwt.recovery-expiration:600000}") // 10 minutes
    private Long recoveryExpiration;

    @Value("${jwt.oauth2-temp-expiration:600000}") // 10 minutes
    private Long oauth2TempExpiration;

    @Value("${jwt.password-reset-expiration:3600000}") // 1 hour
    private Long passwordResetExpiration;

    @Value("${jwt.refresh-expiration:604800000}") // 7 days
    private Long refreshExpiration;

    private static final String TOKEN_TYPE_ACCESS = "access";
    private static final String TOKEN_TYPE_RECOVERY = "recovery";
    private static final String TOKEN_TYPE_OAUTH2_TEMP = "oauth2_temp";
    private static final String TOKEN_TYPE_PASSWORD_RESET = "password_reset";
    private static final String TOKEN_TYPE_REFRESH = "refresh";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Date extractIssuedAt(String token) {
        return extractClaim(token, Claims::getIssuedAt);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // User 객체로 JWT 토큰 생성 (일반 로그인, OAuth2 로그인 모두 사용)
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", TOKEN_TYPE_ACCESS);
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        return createToken(claims, user.getUsername(), expiration);
    }

    // 복구 전용 토큰 생성 (탈퇴 회원 복구용, 10분 유효)
    public String generateRecoveryToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", TOKEN_TYPE_RECOVERY);
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        return createToken(claims, user.getUsername(), recoveryExpiration);
    }

    // UserDetails로 JWT 토큰 생성 (하위 호환성 유지)
    public String generateToken(UserDetails userDetails) {
        if (userDetails instanceof User) {
            return generateToken((User) userDetails);
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", TOKEN_TYPE_ACCESS);
        return createToken(claims, userDetails.getUsername(), expiration);
    }

    private String createToken(Map<String, Object> claims, String subject, Long expirationTime) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    // 토큰 타입 추출
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    // userId 추출
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    // 복구 토큰 검증
    public boolean isRecoveryToken(String token) {
        try {
            String tokenType = extractTokenType(token);
            return TOKEN_TYPE_RECOVERY.equals(tokenType);
        } catch (Exception e) {
            return false;
        }
    }

    // 복구 토큰 유효성 검증 (만료 여부만 체크)
    public boolean validateRecoveryToken(String token) {
        try {
            return isRecoveryToken(token) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.debug("Recovery token expired: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException | SignatureException e) {
            log.warn("Invalid recovery token: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Unexpected error validating recovery token", e);
            return false;
        }
    }

    // OAuth2 임시 토큰 생성 (회원가입용, 10분 유효)
    public String generateOAuth2TempToken(String email, String provider, String providerId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", TOKEN_TYPE_OAUTH2_TEMP);
        claims.put("email", email);
        claims.put("provider", provider);
        claims.put("providerId", providerId);
        return createToken(claims, email, oauth2TempExpiration);
    }

    // OAuth2 임시 토큰 여부 확인
    public boolean isOAuth2TempToken(String token) {
        try {
            String tokenType = extractTokenType(token);
            return TOKEN_TYPE_OAUTH2_TEMP.equals(tokenType);
        } catch (Exception e) {
            return false;
        }
    }

    // OAuth2 임시 토큰 유효성 검증
    public boolean validateOAuth2TempToken(String token) {
        try {
            return isOAuth2TempToken(token) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.debug("OAuth2 temp token expired: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException | SignatureException e) {
            log.warn("Invalid OAuth2 temp token: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Unexpected error validating OAuth2 temp token", e);
            return false;
        }
    }

    // OAuth2 임시 토큰에서 이메일 추출
    public String extractOAuth2Email(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    // OAuth2 임시 토큰에서 provider 추출
    public String extractOAuth2Provider(String token) {
        return extractClaim(token, claims -> claims.get("provider", String.class));
    }

    // OAuth2 임시 토큰에서 providerId 추출
    public String extractOAuth2ProviderId(String token) {
        return extractClaim(token, claims -> claims.get("providerId", String.class));
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // 비밀번호 재설정 토큰 생성 (1시간 유효)
    public String generatePasswordResetToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", TOKEN_TYPE_PASSWORD_RESET);
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        return createToken(claims, user.getUsername(), passwordResetExpiration);
    }

    // 비밀번호 재설정 토큰 여부 확인
    public boolean isPasswordResetToken(String token) {
        try {
            String tokenType = extractTokenType(token);
            return TOKEN_TYPE_PASSWORD_RESET.equals(tokenType);
        } catch (Exception e) {
            return false;
        }
    }

    // 비밀번호 재설정 토큰 유효성 검증
    public boolean validatePasswordResetToken(String token) {
        try {
            return isPasswordResetToken(token) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.debug("Password reset token expired: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException | SignatureException e) {
            log.warn("Invalid password reset token: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Unexpected error validating password reset token", e);
            return false;
        }
    }

    // 리프레시 토큰 생성 (7일 유효)
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", TOKEN_TYPE_REFRESH);
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        return createToken(claims, user.getUsername(), refreshExpiration);
    }

    // 리프레시 토큰 여부 확인
    public boolean isRefreshToken(String token) {
        try {
            String tokenType = extractTokenType(token);
            return TOKEN_TYPE_REFRESH.equals(tokenType);
        } catch (Exception e) {
            return false;
        }
    }

    // 리프레시 토큰 유효성 검증 (만료 여부만 체크)
    public boolean validateRefreshToken(String token) {
        try {
            return isRefreshToken(token) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.debug("Refresh token expired: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException | SignatureException e) {
            log.warn("Invalid refresh token: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Unexpected error validating refresh token", e);
            return false;
        }
    }
}
