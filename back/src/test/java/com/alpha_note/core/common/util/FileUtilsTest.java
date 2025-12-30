package com.alpha_note.core.common.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("FileUtils 테스트")
class FileUtilsTest {

    @Test
    @DisplayName("파일 확장자 추출 - 정상 케이스")
    void getFileExtension_Success() {
        // given
        String fileName = "test.jpg";

        // when
        String extension = FileUtils.getFileExtension(fileName);

        // then
        assertThat(extension).isEqualTo(".jpg");
    }

    @Test
    @DisplayName("파일 확장자 추출 - 확장자 없음")
    void getFileExtension_NoExtension() {
        // given
        String fileName = "testfile";

        // when
        String extension = FileUtils.getFileExtension(fileName);

        // then
        assertThat(extension).isEmpty();
    }

    @Test
    @DisplayName("파일 확장자 추출 - null 입력")
    void getFileExtension_Null() {
        // when
        String extension = FileUtils.getFileExtension(null);

        // then
        assertThat(extension).isEmpty();
    }

    @Test
    @DisplayName("파일 확장자 추출 - 빈 문자열")
    void getFileExtension_Empty() {
        // when
        String extension = FileUtils.getFileExtension("");

        // then
        assertThat(extension).isEmpty();
    }

    @Test
    @DisplayName("고유 파일명 생성")
    void generateUniqueFileName() {
        // given
        String originalFileName = "test.jpg";

        // when
        String uniqueFileName = FileUtils.generateUniqueFileName(originalFileName);

        // then
        assertThat(uniqueFileName).endsWith(".jpg");
        assertThat(uniqueFileName).hasSize(40); // UUID(36) + .jpg(4)
    }

    @Test
    @DisplayName("확장자 제외 파일명 추출")
    void getFileNameWithoutExtension() {
        // given
        String fileName = "test.jpg";

        // when
        String nameWithoutExtension = FileUtils.getFileNameWithoutExtension(fileName);

        // then
        assertThat(nameWithoutExtension).isEqualTo("test");
    }

    @Test
    @DisplayName("파일명 정리 - 특수문자 제거")
    void sanitizeFileName() {
        // given
        String fileName = "test file@#$.jpg";

        // when
        String sanitized = FileUtils.sanitizeFileName(fileName);

        // then
        assertThat(sanitized).isEqualTo("test_file___.jpg");
    }

    @Test
    @DisplayName("파일 크기 포맷 - 바이트")
    void formatFileSize_Bytes() {
        // given
        long bytes = 500;

        // when
        String formatted = FileUtils.formatFileSize(bytes);

        // then
        assertThat(formatted).isEqualTo("500 B");
    }

    @Test
    @DisplayName("파일 크기 포맷 - 킬로바이트")
    void formatFileSize_Kilobytes() {
        // given
        long bytes = 1024 * 5; // 5 KB

        // when
        String formatted = FileUtils.formatFileSize(bytes);

        // then
        assertThat(formatted).isEqualTo("5.0 KB");
    }

    @Test
    @DisplayName("파일 크기 포맷 - 메가바이트")
    void formatFileSize_Megabytes() {
        // given
        long bytes = 1024 * 1024 * 2; // 2 MB

        // when
        String formatted = FileUtils.formatFileSize(bytes);

        // then
        assertThat(formatted).isEqualTo("2.0 MB");
    }
}

