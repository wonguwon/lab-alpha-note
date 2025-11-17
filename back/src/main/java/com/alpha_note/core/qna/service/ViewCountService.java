package com.alpha_note.core.qna.service;

/**
 * 조회수 추적 서비스 인터페이스
 * - 추상화 레이어: RDS 또는 Redis 구현체로 전환 가능
 * - 조회 기록 저장 및 조회
 */
public interface ViewCountService {

    /**
     * 사용자가 특정 질문을 이미 조회했는지 확인
     *
     * @param questionId 질문 ID
     * @param userId     사용자 ID
     * @return 조회한 적 있으면 true, 없으면 false
     */
    boolean hasViewed(Long questionId, Long userId);

    /**
     * 사용자의 질문 조회 기록 저장
     *
     * @param questionId 질문 ID
     * @param userId     사용자 ID
     */
    void recordView(Long questionId, Long userId);
}
