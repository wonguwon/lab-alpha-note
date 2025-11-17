package com.alpha_note.core.qna.enums;

/**
 * 질문 검색 타입
 * - ALL: 제목 + 내용 검색 (기본값)
 * - TITLE: 제목만 검색
 * - CONTENT: 내용만 검색
 * - AUTHOR: 작성자 닉네임 검색
 */
public enum SearchType {
    ALL,
    TITLE,
    CONTENT,
    AUTHOR
}
