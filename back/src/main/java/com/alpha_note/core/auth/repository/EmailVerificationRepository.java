package com.alpha_note.core.auth.repository;

import com.alpha_note.core.auth.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    /**
     * 이메일로 가장 최근 인증 정보 조회
     */
    Optional<EmailVerification> findTopByEmailOrderByCreatedAtDesc(String email);

    /**
     * 이메일과 인증 여부로 조회
     */
    Optional<EmailVerification> findByEmailAndVerified(String email, Boolean verified);

    /**
     * 만료되지 않은 인증 정보 조회
     */
    Optional<EmailVerification> findByEmailAndExpiresAtAfter(String email, Instant now);

    /**
     * 만료된 인증 데이터 삭제 (배치 작업용)
     */
    void deleteByExpiresAtBefore(Instant expiryTime);
}
