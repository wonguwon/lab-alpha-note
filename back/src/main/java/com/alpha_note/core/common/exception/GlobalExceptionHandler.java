package com.alpha_note.core.common.exception;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.security.jwt.JwtUtil;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final JwtUtil jwtUtil;
    
    /**
     * 커스텀 예외 처리
     */
    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        log.error("CustomException: {}", e.getMessage());
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage()));
    }
    
    /**
     * Validation 예외 처리 (@Valid)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("MethodArgumentNotValidException: {}", e.getMessage());
        String message = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity
                .status(ErrorCode.INVALID_INPUT_VALUE.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE.getCode(), message));
    }
    
    /**
     * Bind 예외 처리
     */
    @ExceptionHandler(BindException.class)
    protected ResponseEntity<ApiResponse<Void>> handleBindException(BindException e) {
        log.error("BindException: {}", e.getMessage());
        String message = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity
                .status(ErrorCode.INVALID_INPUT_VALUE.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE.getCode(), message));
    }
    
    /**
     * 타입 미스매치 예외 처리
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<ApiResponse<Void>> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        log.error("MethodArgumentTypeMismatchException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.INVALID_TYPE_VALUE.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.INVALID_TYPE_VALUE.getCode(), ErrorCode.INVALID_TYPE_VALUE.getMessage()));
    }
    
    /**
     * 필수 파라미터 누락 예외 처리
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    protected ResponseEntity<ApiResponse<Void>> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        log.error("MissingServletRequestParameterException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.MISSING_REQUEST_PARAMETER.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.MISSING_REQUEST_PARAMETER.getCode(), ErrorCode.MISSING_REQUEST_PARAMETER.getMessage()));
    }
    
    /**
     * HTTP 메서드 예외 처리
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected ResponseEntity<ApiResponse<Void>> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.error("HttpRequestMethodNotSupportedException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.METHOD_NOT_ALLOWED.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.METHOD_NOT_ALLOWED.getCode(), ErrorCode.METHOD_NOT_ALLOWED.getMessage()));
    }
    
    /**
     * 탈퇴한 회원 계정 예외 처리
     * 복구 가능한 경우 recoveryToken 발급
     */
    @ExceptionHandler(UserAccountDeletedException.class)
    protected ResponseEntity<ApiResponse<Map<String, Object>>> handleUserAccountDeletedException(UserAccountDeletedException e) {
        User user = e.getUser();
        log.warn("Deleted account login attempt: userId={}, email={}, canRecover={}",
                user.getId(), user.getEmail(), user.canBeRecovered());

        // 복구 가능한 경우 (60일 이내)
        if (user.canBeRecovered()) {
            String recoveryToken = jwtUtil.generateRecoveryToken(user);
            Map<String, Object> data = new HashMap<>();
            data.put("recoveryToken", recoveryToken);
            data.put("canRecover", true);
            data.put("email", user.getEmail());

            return ResponseEntity
                    .status(ErrorCode.USER_ACCOUNT_DELETED.getHttpStatus())
                    .body(ApiResponse.error(ErrorCode.USER_ACCOUNT_DELETED.getCode(),
                          "탈퇴한 계정입니다. 복구하시겠습니까?", data));
        }

        // 복구 불가능한 경우 (60일 경과)
        return ResponseEntity
                .status(ErrorCode.ACCOUNT_NOT_RECOVERABLE.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.ACCOUNT_NOT_RECOVERABLE.getCode(),
                      ErrorCode.ACCOUNT_NOT_RECOVERABLE.getMessage()));
    }

    /**
     * Spring Security 내부 인증 예외 처리
     * UserDetailsService에서 발생한 예외가 래핑되어 전달됨
     */
    @ExceptionHandler(InternalAuthenticationServiceException.class)
    protected ResponseEntity<ApiResponse<Map<String, Object>>> handleInternalAuthenticationServiceException(InternalAuthenticationServiceException e) {
        log.error("InternalAuthenticationServiceException: {}, cause: {}", e.getMessage(), e.getCause());

        // 원본 예외 확인
        Throwable cause = e.getCause();

        // UserAccountDeletedException이 원인이면 별도 처리
        if (cause instanceof UserAccountDeletedException) {
            return handleUserAccountDeletedException((UserAccountDeletedException) cause);
        }

        // DisabledException이 원인이면 탈퇴 회원 에러 반환 (하위 호환성)
        if (cause instanceof DisabledException) {
            return ResponseEntity
                    .status(ErrorCode.USER_ACCOUNT_DELETED.getHttpStatus())
                    .body(ApiResponse.error(ErrorCode.USER_ACCOUNT_DELETED.getCode(), ErrorCode.USER_ACCOUNT_DELETED.getMessage()));
        }

        // 그 외의 경우 일반 인증 에러 반환
        return ResponseEntity
                .status(ErrorCode.UNAUTHORIZED.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.UNAUTHORIZED.getCode(), ErrorCode.UNAUTHORIZED.getMessage()));
    }

    /**
     * 계정 잠김 예외 처리 (탈퇴한 회원 등)
     */
    @ExceptionHandler(LockedException.class)
    protected ResponseEntity<ApiResponse<Void>> handleLockedException(LockedException e) {
        log.error("LockedException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.USER_ACCOUNT_DELETED.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.USER_ACCOUNT_DELETED.getCode(), ErrorCode.USER_ACCOUNT_DELETED.getMessage()));
    }

    /**
     * 계정 비활성화 예외 처리
     */
    @ExceptionHandler(DisabledException.class)
    protected ResponseEntity<ApiResponse<Void>> handleDisabledException(DisabledException e) {
        log.error("DisabledException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.USER_ACCOUNT_DELETED.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.USER_ACCOUNT_DELETED.getCode(), ErrorCode.USER_ACCOUNT_DELETED.getMessage()));
    }

    /**
     * 인증 예외 처리
     */
    @ExceptionHandler(AuthenticationException.class)
    protected ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException e) {
        log.error("AuthenticationException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.UNAUTHORIZED.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.UNAUTHORIZED.getCode(), ErrorCode.UNAUTHORIZED.getMessage()));
    }
    
    /**
     * 접근 거부 예외 처리
     */
    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException e) {
        log.error("AccessDeniedException: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.ACCESS_DENIED.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.ACCESS_DENIED.getCode(), ErrorCode.ACCESS_DENIED.getMessage()));
    }
    
    /**
     * 기타 예외 처리
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Exception: {}", e.getMessage(), e);
        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR.getCode(), ErrorCode.INTERNAL_SERVER_ERROR.getMessage()));
    }
}
