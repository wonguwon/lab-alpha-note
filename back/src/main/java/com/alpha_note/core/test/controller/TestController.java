package com.alpha_note.core.test.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/protected")
    public ResponseEntity<ApiResponse<String>> protectedEndpoint(@AuthenticationPrincipal User user) {
        String message = "Hello " + user.getUsername() + "! This is a protected endpoint.";
        return ResponseEntity.ok(ApiResponse.success(message));
    }
    
    @GetMapping("/user-info")
    public ResponseEntity<ApiResponse<User>> getUserInfo(@AuthenticationPrincipal User user) {
        // 비밀번호 제거
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("사용자 정보 조회 성공", user));
    }
}
