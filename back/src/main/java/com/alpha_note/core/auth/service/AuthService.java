package com.alpha_note.core.auth.service;

import com.alpha_note.core.auth.dto.AuthResponse;
import com.alpha_note.core.auth.dto.LoginRequest;
import com.alpha_note.core.auth.dto.RegisterRequest;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.user.entity.AuthProvider;
import com.alpha_note.core.user.entity.Role;
import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import com.alpha_note.core.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailVerificationService emailVerificationService;

    public AuthResponse register(RegisterRequest request) {
        // 이메일 인증 확인
        if (!emailVerificationService.isVerified(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        // 중복 체크
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException(ErrorCode.DUPLICATE_USERNAME);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }
        
        // 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .build();
        
        userRepository.save(user);
        
        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user);
        
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            // 인증
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            User user = (User) authentication.getPrincipal();
            
            // JWT 토큰 생성
            String token = jwtUtil.generateToken(user);
            
            return AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();
                    
        } catch (BadCredentialsException e) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }
    }
}
