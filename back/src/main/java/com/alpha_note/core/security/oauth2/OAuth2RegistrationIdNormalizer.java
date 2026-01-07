package com.alpha_note.core.security.oauth2;

/**
 * OAuth2 Registration ID 정규화 유틸리티
 * 
 * 여러 Registration을 하나의 Provider로 매핑하기 위한 정규화 처리
 * 예: "google", "google-signup" → "google"
 */
public class OAuth2RegistrationIdNormalizer {

    /**
     * Registration ID를 정규화하여 실제 Provider 이름으로 변환
     * 
     * @param registrationId OAuth2 클라이언트 등록 ID
     * @return 정규화된 Provider 이름
     */
    public static String normalize(String registrationId) {
        if (registrationId == null) {
            return null;
        }
        
        // Google 관련 모든 registrationId를 "google"로 통일
        // 예: "google", "google-signup", "google-admin" 등
        if (registrationId.startsWith("google")) {
            return "google";
        }
        
        // 향후 다른 Provider 추가 시 여기에 추가
        // 예: kakao, naver 등
        
        return registrationId;
    }
}

