package com.alpha_note.core.support.controller;

import com.alpha_note.core.auth.service.EmailService;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.support.dto.ContactRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 고객 지원 컨트롤러
 * - 문의사항 및 에러 보고
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
public class SupportController {

    private final EmailService emailService;

    /**
     * 문의사항/에러 보고 발송
     *
     * @param request 문의 요청 정보
     * @return 발송 성공 응답
     */
    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<Void>> sendContactEmail(
            @Valid @RequestBody ContactRequest request) {

        emailService.sendContactEmail(request);

        log.info("Contact request received - Type: {}, Email: {}",
                request.getType(), request.getEmail());

        return ResponseEntity.ok(
                ApiResponse.success("문의사항이 성공적으로 전송되었습니다.", null)
        );
    }
}
