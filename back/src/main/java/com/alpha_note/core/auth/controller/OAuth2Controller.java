package com.alpha_note.core.auth.controller;

import com.alpha_note.core.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2Controller {
    
    @GetMapping("/login/google")
    public ResponseEntity<ApiResponse<Map<String, String>>> googleLogin() {
        Map<String, String> response = Map.of(
            "message", "Redirect to Google OAuth2",
            "url", "/oauth2/authorize/google"
        );
        return ResponseEntity.ok(ApiResponse.success("Google 로그인 URL 생성 완료", response));
    }
    
    @GetMapping("/success")
    public ResponseEntity<ApiResponse<String>> loginSuccess() {
        return ResponseEntity.ok(ApiResponse.success("OAuth2 login successful!"));
    }
}
