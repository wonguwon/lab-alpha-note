package com.alpha_note.core.controller;

import com.alpha_note.core.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok("Hello " + user.getUsername() + "! This is a protected endpoint.");
    }
    
    @GetMapping("/user-info")
    public ResponseEntity<User> getUserInfo(@AuthenticationPrincipal User user) {
        // 비밀번호 제거
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
