package com.alpha_note.core.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2Controller {
    
    @GetMapping("/login/google")
    public ResponseEntity<Map<String, String>> googleLogin() {
        return ResponseEntity.ok(Map.of(
            "message", "Redirect to Google OAuth2",
            "url", "/oauth2/authorize/google"
        ));
    }
    
    @GetMapping("/success")
    public ResponseEntity<String> loginSuccess() {
        return ResponseEntity.ok("OAuth2 login successful!");
    }
}
