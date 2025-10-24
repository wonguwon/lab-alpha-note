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

/**
 * 이메일 전송 서비스
 * - HTML 템플릿 기반 이메일 전송
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

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
     * 이메일 본문 HTML 생성
     */
    private String buildEmailContent(String code) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 16px;
                            padding: 40px;
                            text-align: center;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        }
                        .logo {
                            font-size: 32px;
                            font-weight: bold;
                            color: white;
                            margin-bottom: 20px;
                        }
                        .content {
                            background: white;
                            border-radius: 12px;
                            padding: 40px;
                            margin-top: 20px;
                        }
                        .code-box {
                            background: #f7f7f7;
                            border: 2px dashed #667eea;
                            border-radius: 8px;
                            padding: 30px;
                            margin: 30px 0;
                        }
                        .code {
                            font-size: 36px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #667eea;
                            font-family: 'Courier New', monospace;
                        }
                        .warning {
                            color: #ff6b6b;
                            font-size: 14px;
                            margin-top: 20px;
                        }
                        .footer {
                            color: rgba(255,255,255,0.8);
                            font-size: 12px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">📝 AlphaNote</div>
                        <div class="content">
                            <h2>이메일 인증 코드</h2>
                            <p>회원가입을 위해 아래의 인증 코드를 입력해주세요.</p>

                            <div class="code-box">
                                <div class="code">%s</div>
                            </div>

                            <p class="warning">
                                ⏰ 이 코드는 5분간 유효합니다.<br>
                                본인이 요청하지 않았다면 이 이메일을 무시하세요.
                            </p>
                        </div>
                        <div class="footer">
                            © 2025 AlphaNote. All rights reserved.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(code);
    }
}
