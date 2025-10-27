package com.alpha_note.core.auth.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * 이메일 전송 서비스
 * - Thymeleaf 템플릿 기반 이메일 전송
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    /**
     * 인증 코드 이메일 전송
     *
     * @param to   수신자 이메일
     * @param code 인증 코드 (6자리)
     */
    public void sendVerificationCode(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[AlphaNote] 이메일 인증 코드");
            helper.setText(buildEmailContent(code), true);

            mailSender.send(message);
            log.info("Verification email sent to: {}", to);

        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
            throw new CustomException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    /**
     * Thymeleaf를 사용한 이메일 본문 HTML 생성
     *
     * @param code 인증 코드
     * @return 렌더링된 HTML 문자열
     */
    private String buildEmailContent(String code) {
        Context context = new Context();
        context.setVariable("code", code);
        return templateEngine.process("email/verification-code", context);
    }
}
