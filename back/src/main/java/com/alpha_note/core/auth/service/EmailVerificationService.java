package com.alpha_note.core.auth.service;

import com.alpha_note.core.auth.entity.EmailVerification;
import com.alpha_note.core.auth.repository.EmailVerificationRepository;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

/**
 * 이메일 인증 서비스
 * - 인증 코드 생성 및 전송
 * - 인증 코드 검증
 * - 재전송 제한 및 시도 횟수 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationRepository verificationRepository;
    private final EmailService emailService;

    @Value("${spring.mail.auth-code-expiration-millis:300000}") // 기본값 5분
    private long expirationMillis;

    private static final int CODE_LENGTH = 6;
    private static final int MAX_ATTEMPTS = 5;
    private static final long RESEND_COOLDOWN_SECONDS = 60;

    /**
     * 인증 코드 생성 및 이메일 전송
     *
     * @param email 수신자 이메일
     * @return 만료 시간
     */
    @Transactional
    public Instant sendVerificationCode(String email) {
        // 재전송 제한 체크 (60초)
        checkResendCooldown(email);

        // 기존 인증 레코드 삭제 (새 인증 코드 발송 시 이전 인증 무효화)
        verificationRepository.deleteAllByEmail(email);

        // 인증 코드 생성 (6자리 숫자)
        String code = generateVerificationCode();

        // 만료 시간 계산
        Instant expiresAt = Instant.now().plusMillis(expirationMillis);

        // 이메일 인증 엔티티 생성 및 저장
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .verified(false)
                .attemptCount(0)
                .expiresAt(expiresAt)
                .build();

        verificationRepository.save(verification);

        // 이메일 전송
        emailService.sendVerificationCode(email, code);

        log.info("Verification code sent to: {}", email);
        return expiresAt;
    }

    /**
     * 인증 코드 검증
     *
     * @param email 이메일
     * @param code  인증 코드
     * @return 인증 성공 여부
     */
    @Transactional
    public boolean verifyCode(String email, String code) {
        // 최신 인증 정보 조회
        EmailVerification verification = verificationRepository
                .findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new CustomException(ErrorCode.EMAIL_CODE_INVALID));

        // 만료 체크
        if (verification.isExpired()) {
            throw new CustomException(ErrorCode.EMAIL_CODE_EXPIRED);
        }

        // 시도 횟수 체크
        if (verification.isAttemptsExceeded()) {
            throw new CustomException(ErrorCode.EMAIL_CODE_ATTEMPTS_EXCEEDED);
        }

        // 코드 일치 여부 확인
        if (!verification.getCode().equals(code)) {
            verification.incrementAttemptCount();
            verificationRepository.save(verification);
            throw new CustomException(ErrorCode.EMAIL_CODE_INVALID);
        }

        // 인증 완료 처리
        verification.markAsVerified();
        verificationRepository.save(verification);

        log.info("Email verified successfully: {}", email);
        return true;
    }

    /**
     * 이메일 인증 완료 여부 확인
     *
     * @param email 이메일
     * @return 인증 완료 여부
     */
    @Transactional(readOnly = true)
    public boolean isVerified(String email) {
        Optional<EmailVerification> verification =
                verificationRepository.findTopByEmailAndVerifiedOrderByCreatedAtDesc(email, true);
        return verification.isPresent();
    }

    /**
     * 재전송 제한 체크 (60초)
     */
    private void checkResendCooldown(String email) {
        Optional<EmailVerification> lastVerification =
                verificationRepository.findTopByEmailOrderByCreatedAtDesc(email);

        if (lastVerification.isPresent()) {
            Instant lastSentAt = lastVerification.get().getCreatedAt();
            long secondsSinceLastSent = ChronoUnit.SECONDS.between(lastSentAt, Instant.now());

            if (secondsSinceLastSent < RESEND_COOLDOWN_SECONDS) {
                log.warn("Resend cooldown violation for email: {}", email);
                throw new CustomException(ErrorCode.EMAIL_SEND_COOLDOWN);
            }
        }
    }

    /**
     * 6자리 랜덤 인증 코드 생성
     */
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = random.nextInt(900000) + 100000; // 100000 ~ 999999
        return String.valueOf(code);
    }

    /**
     * 특정 이메일의 모든 인증 레코드 삭제
     * 회원가입 완료 시 인증 데이터 정리용
     *
     * @param email 이메일
     */
    @Transactional
    public void deleteByEmail(String email) {
        verificationRepository.deleteAllByEmail(email);
        log.info("Email verification records deleted for: {}", email);
    }
}
