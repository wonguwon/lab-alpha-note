package com.alpha_note.core.user.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.user.dto.*;
import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.user.deletion.retention-days:60}")
    private int retentionDays;

    @Value("${cloud.aws.s3.cdnBaseUrl}")
    private String cdnBaseUrl;

    /**
     * 일반 프로필 정보 업데이트 (닉네임 등)
     */
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 닉네임 업데이트 (제공된 경우에만)
        if (request.getNickname() != null && !request.getNickname().trim().isEmpty()) {
            // 닉네임 중복 체크 (자기 자신 제외)
            if (!request.getNickname().equals(user.getNickname()) &&
                    userRepository.existsByNickname(request.getNickname())) {
                throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
            }
            user.updateNickname(request.getNickname());
        }

        // 향후 다른 필드 추가 시 여기에 추가
        // if (request.getBio() != null) { user.updateBio(request.getBio()); }

        User updatedUser = userRepository.save(user);
        return UserResponse.from(updatedUser);
    }

    /**
     * 비밀번호 변경
     */
    @Transactional
    public void updatePassword(Long userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // OAuth2 사용자는 비밀번호 변경 불가
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new CustomException(ErrorCode.OAUTH2_USER_PASSWORD_CHANGE_NOT_ALLOWED);
        }

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INCORRECT_PASSWORD);
        }

        // 새 비밀번호 설정
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        user.updatePassword(encodedPassword);
        userRepository.save(user);

        log.info("Password updated for user: {}", user.getEmail());
    }

    /**
     * 이메일 변경
     * TODO: 이메일 인증 프로세스 추가 필요
     */
    @Transactional
    public UserResponse updateEmail(Long userId, UpdateEmailRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getNewEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        // TODO: 이메일 인증 로직 추가
        // 1. 새 이메일로 인증 코드 전송
        // 2. 인증 완료 후에만 이메일 업데이트
        // 현재는 바로 업데이트 (추후 개선 필요)

        user.updateEmail(request.getNewEmail());
        User updatedUser = userRepository.save(user);

        log.info("Email updated for user: {} -> {}", userId, request.getNewEmail());
        return UserResponse.from(updatedUser);
    }

    /**
     * 프로필 이미지 URL 업데이트 (S3 업로드 후 호출)
     */
    @Transactional
    public UserResponse updateProfileImageUrl(Long userId, String profileImageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // CDN URL 검증 (보안)
        if (!isValidImageUrl(profileImageUrl)) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }

        user.updateProfileImage(profileImageUrl);
        User updatedUser = userRepository.save(user);

        log.info("Profile image URL updated for user: {}", user.getEmail());
        return UserResponse.from(updatedUser);
    }

    /**
     * 프로필 이미지 삭제
     */
    @Transactional
    public UserResponse deleteProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.deleteProfileImage();
        User updatedUser = userRepository.save(user);

        log.info("Profile image deleted for user: {}", user.getEmail());
        return UserResponse.from(updatedUser);
    }

    /**
     * 프로필 이미지 URL 검증 (CDN URL 또는 OAuth2 프로필 URL)
     */
    private boolean isValidImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return false;
        }

        // HTTPS로 시작해야 함
        if (!imageUrl.startsWith("https://")) {
            return false;
        }

        // CDN URL이거나 OAuth2 제공자 URL인 경우 허용
        return imageUrl.startsWith(cdnBaseUrl) ||
               imageUrl.contains("googleusercontent.com") ||  // Google OAuth2
               imageUrl.contains("graph.facebook.com");        // Facebook OAuth2 (향후 지원 시)
    }

    /**
     * 회원 탈퇴 (Soft Delete)
     * 60일 후 자동 완전 삭제
     */
    @Transactional
    public void deleteAccount(Long userId, DeleteAccountRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 이미 탈퇴한 계정 체크
        if (user.isDeleted()) {
            throw new CustomException(ErrorCode.USER_ALREADY_DELETED);
        }

        // LOCAL 사용자인 경우 비밀번호 검증
        if (user.getProvider() == AuthProvider.LOCAL) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new CustomException(ErrorCode.INCORRECT_PASSWORD);
            }
        }
        // OAuth2 사용자는 비밀번호 검증 생략

        // 소프트 삭제 처리
        user.markForDeletion(retentionDays);
        userRepository.save(user);

        log.info("User account marked for deletion: userId={}, email={}, scheduledDeletionAt={}",
                user.getId(), user.getEmail(), user.getDeletionScheduledAt());

        // TODO: 탈퇴 알림 이메일 발송 (선택사항)
    }

    /**
     * 계정 복구 (60일 이내)
     */
    @Transactional
    public UserResponse recoverAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!user.canBeRecovered()) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        user.recover();
        User recoveredUser = userRepository.save(user);

        log.info("User account recovered: userId={}, email={}", user.getId(), user.getEmail());
        return UserResponse.from(recoveredUser);
    }
}
