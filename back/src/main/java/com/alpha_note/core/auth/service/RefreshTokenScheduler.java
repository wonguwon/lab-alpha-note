package com.alpha_note.core.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 리프레시 토큰 정리 스케줄러
 * 만료된 리프레시 토큰을 주기적으로 삭제
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenScheduler {

    private final RefreshTokenService refreshTokenService;

    /**
     * 매일 새벽 3시에 실행
     * 만료된 리프레시 토큰 정리
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanExpiredRefreshTokens() {
        log.info("Starting scheduled cleanup of expired refresh tokens");
        
        try {
            refreshTokenService.cleanExpiredTokens();
            log.info("Successfully completed cleanup of expired refresh tokens");
        } catch (Exception e) {
            log.error("Failed to clean expired refresh tokens", e);
        }
    }
}

