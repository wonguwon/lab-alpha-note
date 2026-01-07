package com.alpha_note.core.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    
    // 공통 에러
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C001", "서버 내부 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C002", "잘못된 입력값입니다."),
    INVALID_TYPE_VALUE(HttpStatus.BAD_REQUEST, "C003", "잘못된 타입입니다."),
    MISSING_REQUEST_PARAMETER(HttpStatus.BAD_REQUEST, "C004", "필수 요청 파라미터가 누락되었습니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C005", "지원하지 않는 HTTP 메서드입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "C006", "접근이 거부되었습니다."),
    
    // 인증 관련 에러
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001", "인증이 필요합니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "A002", "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "A003", "만료된 토큰입니다."),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "A004", "잘못된 아이디/비밀번호입니다."),
    INVALID_RECOVERY_TOKEN(HttpStatus.UNAUTHORIZED, "A005", "유효하지 않은 복구 토큰입니다."),
    EXPIRED_RECOVERY_TOKEN(HttpStatus.UNAUTHORIZED, "A006", "만료된 복구 토큰입니다."),
    OAUTH2_SIGNUP_ALREADY_REGISTERED(HttpStatus.CONFLICT, "A007", "이미 가입된 계정입니다."),
    OAUTH2_LOGIN_NOT_REGISTERED(HttpStatus.UNAUTHORIZED, "A008", "회원가입이 필요합니다."),
    OAUTH2_AUTHENTICATION_FAILED(HttpStatus.UNAUTHORIZED, "A009", "OAuth2 인증에 실패했습니다."),
    OAUTH2_PROVIDER_MISMATCH(HttpStatus.CONFLICT, "A010", "다른 로그인 방식으로 가입된 계정입니다."),
    SOCIAL_ACCOUNT_PASSWORD_RESET(HttpStatus.BAD_REQUEST, "A011", "소셜 가입된 계정입니다. 소셜 로그인을 이용해주세요."),
    INVALID_PASSWORD_RESET_TOKEN(HttpStatus.UNAUTHORIZED, "A012", "유효하지 않은 비밀번호 재설정 토큰입니다."),
    EXPIRED_PASSWORD_RESET_TOKEN(HttpStatus.UNAUTHORIZED, "A013", "만료된 비밀번호 재설정 토큰입니다."),
    PASSWORD_RESET_TOKEN_ALREADY_USED(HttpStatus.BAD_REQUEST, "A014", "이미 사용된 비밀번호 재설정 토큰입니다."),
    
    // 사용자 관련 에러
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "U002", "이미 존재하는 닉네임입니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "U003", "이미 존재하는 이메일입니다."),
    INCORRECT_PASSWORD(HttpStatus.BAD_REQUEST, "U004", "현재 비밀번호가 일치하지 않습니다."),
    OAUTH2_USER_PASSWORD_CHANGE_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "U005", "소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다."),
    INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "U006", "지원하지 않는 파일 형식입니다."),
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "U007", "파일 크기가 제한을 초과했습니다."),
    USER_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "U008", "이미 탈퇴 처리된 계정입니다."),
    ACCOUNT_IN_GRACE_PERIOD(HttpStatus.CONFLICT, "U009", "해당 계정은 복구 가능 기간(60일) 중입니다. 기간 경과 후 재가입이 가능합니다."),
    USER_ACCOUNT_DELETED(HttpStatus.FORBIDDEN, "U010", "탈퇴한 계정입니다. 복구를 원하시면 관리자에게 문의해주세요."),
    ACCOUNT_NOT_RECOVERABLE(HttpStatus.BAD_REQUEST, "U011", "복구할 수 없는 계정입니다. 복구 기간(60일)이 경과했거나 탈퇴하지 않은 계정입니다."),
    PASSWORD_CONTAINS_EMAIL(HttpStatus.BAD_REQUEST, "U012", "비밀번호에 이메일 일부를 포함할 수 없습니다."),

    // 이메일 인증 관련 에러
    EMAIL_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "E001", "이메일 전송에 실패했습니다."),
    EMAIL_CODE_EXPIRED(HttpStatus.BAD_REQUEST, "E002", "인증 코드가 만료되었습니다."),
    EMAIL_CODE_INVALID(HttpStatus.BAD_REQUEST, "E003", "잘못된 인증 코드입니다."),
    EMAIL_CODE_ATTEMPTS_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS, "E004", "인증 시도 횟수를 초과했습니다. 코드를 재전송해주세요."),
    EMAIL_SEND_COOLDOWN(HttpStatus.TOO_MANY_REQUESTS, "E005", "이메일은 60초마다 전송할 수 있습니다."),
    EMAIL_NOT_VERIFIED(HttpStatus.BAD_REQUEST, "E006", "이메일 인증이 완료되지 않았습니다."),

    // 노트 관련 에러 (향후 추가)
    NOTE_NOT_FOUND(HttpStatus.NOT_FOUND, "N001", "노트를 찾을 수 없습니다."),
    NOTE_ACCESS_DENIED(HttpStatus.FORBIDDEN, "N002", "노트에 접근할 권한이 없습니다."),

    // QnA 관련 에러
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "Q001", "질문을 찾을 수 없습니다."),
    QUESTION_ACCESS_DENIED(HttpStatus.FORBIDDEN, "Q002", "질문에 접근할 권한이 없습니다."),
    ANSWER_NOT_FOUND(HttpStatus.NOT_FOUND, "Q003", "답변을 찾을 수 없습니다."),
    ANSWER_ACCESS_DENIED(HttpStatus.FORBIDDEN, "Q004", "답변에 접근할 권한이 없습니다."),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Q005", "댓글을 찾을 수 없습니다."),
    COMMENT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "Q006", "댓글에 접근할 권한이 없습니다."),
    TAG_NOT_FOUND(HttpStatus.NOT_FOUND, "Q007", "태그를 찾을 수 없습니다."),
    VOTE_ALREADY_EXISTS(HttpStatus.CONFLICT, "Q008", "이미 추천한 게시물입니다."),
    VOTE_NOT_FOUND(HttpStatus.NOT_FOUND, "Q009", "추천 기록을 찾을 수 없습니다."),
    ANSWER_ALREADY_ACCEPTED(HttpStatus.CONFLICT, "Q010", "이미 채택된 답변이 있습니다."),
    ONLY_QUESTION_AUTHOR_CAN_ACCEPT(HttpStatus.FORBIDDEN, "Q011", "질문 작성자만 답변을 채택할 수 있습니다."),
    INVALID_ACCEPTED_ANSWER(HttpStatus.BAD_REQUEST, "Q012", "해당 질문의 답변이 아닙니다."),
    TAG_ALREADY_EXISTS(HttpStatus.CONFLICT, "Q013", "이미 존재하는 태그입니다."),
    MAX_TAGS_EXCEEDED(HttpStatus.BAD_REQUEST, "Q014", "태그는 최대 5개까지 추가할 수 있습니다."),
    ATTACHMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Q015", "첨부파일을 찾을 수 없습니다."),
    INVALID_IMAGE_TYPE(HttpStatus.BAD_REQUEST, "Q016", "지원하지 않는 이미지 형식입니다. (PNG, JPEG, WEBP만 가능)"),

    // Habit 관련 에러
    HABIT_NOT_FOUND(HttpStatus.NOT_FOUND, "H001", "습관을 찾을 수 없습니다."),
    HABIT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "H002", "습관에 접근할 권한이 없습니다."),
    HABIT_RECORD_NOT_FOUND(HttpStatus.NOT_FOUND, "H003", "습관 기록을 찾을 수 없습니다."),
    HABIT_RECORD_ACCESS_DENIED(HttpStatus.FORBIDDEN, "H004", "습관 기록에 접근할 권한이 없습니다."),
    HABIT_ALREADY_ARCHIVED(HttpStatus.CONFLICT, "H005", "이미 보관된 습관입니다."),
    HABIT_ALREADY_ACTIVE(HttpStatus.CONFLICT, "H006", "이미 활성 상태인 습관입니다."),
    HABIT_DELETED(HttpStatus.GONE, "H007", "삭제된 습관입니다."),
    FUTURE_RECORD_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "H008", "미래 날짜에 기록을 남길 수 없습니다."),
    RECORD_DATE_BEFORE_START_DATE(HttpStatus.BAD_REQUEST, "H009", "습관 시작일 이전에 기록을 남길 수 없습니다."),
    HABIT_END_DATE_PASSED(HttpStatus.BAD_REQUEST, "H010", "습관 종료일 이후에 기록을 남길 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
