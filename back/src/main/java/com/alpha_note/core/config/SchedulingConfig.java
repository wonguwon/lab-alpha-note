package com.alpha_note.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 스케줄링 설정
 * - 회원 탈퇴 후 60일 경과한 계정 자동 삭제
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
