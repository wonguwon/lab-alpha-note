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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.user.deletion.retention-days:60}")
    private int retentionDays;

    // 프로필 이미지 저장 경로 (추후 설정 파일로 이동 가능)
    private static final String UPLOAD_DIR = "uploads/profile-images/";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"};

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
     * 프로필 이미지 업로드
     */
    @Transactional
    public UserResponse updateProfileImage(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 파일 검증
        validateImageFile(file);

        // 기존 이미지 삭제 (로컬 파일인 경우)
        if (user.getProfileImageUrl() != null && user.getProfileImageUrl().startsWith("/uploads/")) {
            deleteImageFile(user.getProfileImageUrl());
        }

        // 파일 저장
        String savedFileName = saveImageFile(file);
        String imageUrl = "/uploads/profile-images/" + savedFileName;

        user.updateProfileImage(imageUrl);
        User updatedUser = userRepository.save(user);

        log.info("Profile image updated for user: {}", user.getEmail());
        return UserResponse.from(updatedUser);
    }

    /**
     * 프로필 이미지 삭제
     */
    @Transactional
    public UserResponse deleteProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 로컬 파일 삭제
        if (user.getProfileImageUrl() != null && user.getProfileImageUrl().startsWith("/uploads/")) {
            deleteImageFile(user.getProfileImageUrl());
        }

        user.deleteProfileImage();
        User updatedUser = userRepository.save(user);

        log.info("Profile image deleted for user: {}", user.getEmail());
        return UserResponse.from(updatedUser);
    }

    /**
     * 이미지 파일 검증
     */
    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 파일 크기 검증
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new CustomException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        // 파일 확장자 검증
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        boolean isValidExtension = false;
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (extension.equals(allowedExt)) {
                isValidExtension = true;
                break;
            }
        }

        if (!isValidExtension) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }
    }

    /**
     * 이미지 파일 저장
     */
    private String saveImageFile(MultipartFile file) throws IOException {
        // 업로드 디렉토리 생성
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 고유한 파일명 생성
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String savedFileName = UUID.randomUUID().toString() + extension;

        // 파일 저장
        Path filePath = uploadPath.resolve(savedFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return savedFileName;
    }

    /**
     * 이미지 파일 삭제
     */
    private void deleteImageFile(String imageUrl) {
        try {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Failed to delete image file: {}", imageUrl, e);
        }
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
