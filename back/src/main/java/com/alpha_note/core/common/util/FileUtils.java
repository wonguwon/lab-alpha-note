package com.alpha_note.core.common.util;

import java.util.UUID;

/**
 * 파일 관련 유틸리티 클래스
 */
public class FileUtils {

    private FileUtils() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * 파일명에서 확장자를 추출합니다.
     *
     * @param fileName 원본 파일명
     * @return 확장자 (점 포함). 확장자가 없으면 빈 문자열 반환
     */
    public static String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }

        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(lastDotIndex);
    }

    /**
     * UUID를 사용하여 고유한 파일명을 생성합니다.
     *
     * @param originalFileName 원본 파일명
     * @return UUID + 확장자로 구성된 고유 파일명
     */
    public static String generateUniqueFileName(String originalFileName) {
        String extension = getFileExtension(originalFileName);
        return UUID.randomUUID().toString() + extension;
    }

    /**
     * 파일명에서 확장자를 제외한 이름만 추출합니다.
     *
     * @param fileName 원본 파일명
     * @return 확장자를 제외한 파일명
     */
    public static String getFileNameWithoutExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return fileName;
        }

        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return fileName;
        }

        return fileName.substring(0, lastDotIndex);
    }

    /**
     * 파일명을 안전하게 정리합니다. (특수문자 제거)
     *
     * @param fileName 원본 파일명
     * @return 정리된 파일명
     */
    public static String sanitizeFileName(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return fileName;
        }

        // 파일명에서 위험한 문자 제거 (경로 구분자, 특수문자 등)
        return fileName.replaceAll("[^a-zA-Z0-9가-힣.\\-_]", "_");
    }

    /**
     * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
     *
     * @param bytes 파일 크기 (바이트)
     * @return 읽기 쉬운 형식의 파일 크기 (예: "1.5 MB")
     */
    public static String formatFileSize(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }

        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";

        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
