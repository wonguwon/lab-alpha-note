package com.alpha_note.core.auth.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.support.dto.ContactRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${spring.mail.username}")
    private String adminEmail;

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
     * 비밀번호 재설정 링크 이메일 전송
     *
     * @param to        수신자 이메일
     * @param resetLink 비밀번호 재설정 링크
     */
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[AlphaNote] 비밀번호 재설정");
            helper.setText(buildPasswordResetEmailContent(resetLink), true);

            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);

        } catch (MessagingException e) {
            log.error("Failed to send password reset email to: {}", to, e);
            throw new CustomException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    /**
     * 문의사항/에러 보고 이메일 전송
     *
     * @param request 문의 요청 정보
     */
    public void sendContactEmail(ContactRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(request.getEmail());
            helper.setTo(adminEmail);
            helper.setSubject("[AlphaNote 문의] " + request.getType().getDescription() + " - " + request.getSubject());
            helper.setText(buildContactEmailContent(request), true);
            helper.setReplyTo(request.getEmail());

            mailSender.send(message);
            log.info("Contact email sent from: {} (type: {})", request.getEmail(), request.getType());

        } catch (MessagingException e) {
            log.error("Failed to send contact email from: {}", request.getEmail(), e);
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

    /**
     * 비밀번호 재설정 이메일 본문 생성
     *
     * @param resetLink 재설정 링크
     * @return HTML 문자열
     */
    private String buildPasswordResetEmailContent(String resetLink) {
        Context context = new Context();
        context.setVariable("resetLink", resetLink);
        return templateEngine.process("email/password-reset", context);
    }

    /**
     * 문의사항 이메일 본문 생성
     *
     * @param request 문의 요청 정보
     * @return HTML 문자열
     */
    private String buildContactEmailContent(ContactRequest request) {
        Context context = new Context();
        context.setVariable("type", request.getType().getDescription());
        context.setVariable("email", request.getEmail());
        context.setVariable("subject", request.getSubject());
        context.setVariable("content", request.getContent());
        return templateEngine.process("email/contact", context);
    }
}
