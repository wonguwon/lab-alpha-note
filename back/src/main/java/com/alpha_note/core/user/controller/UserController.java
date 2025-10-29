package com.alpha_note.core.user.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.user.dto.*;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 사용자 프로필 관리 API
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 일반 프로필 정보 업데이트 (닉네임 등)
     * PATCH /api/v1/users/me
     */
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {

        UserResponse response = userService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("프로필이 성공적으로 업데이트되었습니다.", response));
    }

    /**
     * 비밀번호 변경 (LOCAL 사용자만)
     * PATCH /api/v1/users/me/password
     */
    @PatchMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdatePasswordRequest request) {

        userService.updatePassword(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("비밀번호가 성공적으로 변경되었습니다.", null));
    }

    /**
     * 이메일 변경
     * PATCH /api/v1/users/me/email
     * TODO: 이메일 인증 프로세스 추가 필요
     */
    @PatchMapping("/me/email")
    public ResponseEntity<ApiResponse<UserResponse>> updateEmail(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateEmailRequest request) {

        UserResponse response = userService.updateEmail(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("이메일이 성공적으로 변경되었습니다.", response));
    }

    /**
     * 프로필 이미지 업로드
     * POST /api/v1/users/me/profile-image
     */
    @PostMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> uploadProfileImage(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) throws IOException {

        UserResponse response = userService.updateProfileImage(user.getId(), file);
        return ResponseEntity.ok(ApiResponse.success("프로필 이미지가 성공적으로 업로드되었습니다.", response));
    }

    /**
     * 프로필 이미지 삭제
     * DELETE /api/v1/users/me/profile-image
     */
    @DeleteMapping("/me/profile-image")
    public ResponseEntity<ApiResponse<UserResponse>> deleteProfileImage(
            @AuthenticationPrincipal User user) {

        UserResponse response = userService.deleteProfileImage(user.getId());
        return ResponseEntity.ok(ApiResponse.success("프로필 이미지가 성공적으로 삭제되었습니다.", response));
    }

    /**
     * 회원 탈퇴
     * DELETE /api/v1/users/me
     * 60일 보관 후 자동 완전 삭제
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DeleteAccountRequest request) {

        userService.deleteAccount(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(
                "회원 탈퇴가 완료되었습니다. 계정 정보는 60일간 보관되며, 60일 경과 후 완전히 삭제됩니다.",
                null));
    }

    /**
     * 계정 복구 (60일 이내)
     * POST /api/v1/users/me/recover
     */
    @PostMapping("/me/recover")
    public ResponseEntity<ApiResponse<UserResponse>> recoverAccount(
            @AuthenticationPrincipal User user) {

        UserResponse response = userService.recoverAccount(user.getId());
        return ResponseEntity.ok(ApiResponse.success("계정이 성공적으로 복구되었습니다.", response));
    }
}
