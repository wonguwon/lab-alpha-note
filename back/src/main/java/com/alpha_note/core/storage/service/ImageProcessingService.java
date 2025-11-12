package com.alpha_note.core.storage.service;

import com.alpha_note.core.common.util.FileUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * 이미지 처리 서비스
 * - URL에서 이미지 다운로드
 * - 이미지 리사이징
 * - S3 업로드
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImageProcessingService {

    private final S3Service s3Service;

    @Value("${cloud.aws.s3.profile.imageSize}")
    private Integer profileImageSize;

    @Value("${cloud.aws.s3.profile.defaultImagePath}")
    private String defaultImagePath;

    @Value("${cloud.aws.s3.cdnBaseUrl}")
    private String cdnBaseUrl;

    private static final int DOWNLOAD_TIMEOUT = 10000; // 10초
    private static final int MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String PROFILE_PATH_FORMAT = "public/profiles/user-%d"; // 프로필 이미지 경로 포맷

    /**
     * OAuth2 프로필 이미지를 처리하여 S3에 업로드
     * @param imageUrl OAuth2 제공자의 이미지 URL
     * @param userId 사용자 ID (경로 생성에 사용)
     * @return CloudFront CDN URL (실패 시 기본 이미지 URL)
     */
    public String processOAuth2ProfileImage(String imageUrl, Long userId) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            log.warn("Profile image URL is null or empty, using default image");
            return getDefaultProfileImageUrl();
        }

        try {
            // 1. URL에서 이미지 다운로드
            log.info("Downloading profile image from: {}", imageUrl);
            BufferedImage originalImage = downloadImage(imageUrl);

            // 2. 이미지 리사이징
            log.info("Resizing image to {}x{}", profileImageSize, profileImageSize);
            BufferedImage resizedImage = resizeImage(originalImage, profileImageSize);

            // 3. BufferedImage를 InputStream으로 변환
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "png", baos);
            byte[] imageBytes = baos.toByteArray();
            InputStream imageStream = new ByteArrayInputStream(imageBytes);

            // 4. S3에 업로드 (public/profiles/user-{userId}/ 경로 사용)
            String filePath = String.format(PROFILE_PATH_FORMAT, userId);
            String fileName = FileUtils.generateUniqueFileName("profile.png");
            String cdnUrl = s3Service.uploadFile(imageStream, imageBytes.length, "image/png", filePath, fileName);

            log.info("Successfully processed and uploaded profile image: {}", cdnUrl);
            return cdnUrl;

        } catch (Exception e) {
            log.error("Failed to process OAuth2 profile image from URL: {} for user: {}", imageUrl, userId, e);
            return getDefaultProfileImageUrl();
        }
    }

    /**
     * URL에서 이미지 다운로드
     * @param imageUrl 다운로드할 이미지 URL
     * @return BufferedImage
     */
    private BufferedImage downloadImage(String imageUrl) throws Exception {
        URL url = new URL(imageUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setConnectTimeout(DOWNLOAD_TIMEOUT);
        connection.setReadTimeout(DOWNLOAD_TIMEOUT);
        connection.setRequestProperty("User-Agent", "Mozilla/5.0");

        // Content-Length 확인 (너무 큰 이미지 방지)
        int contentLength = connection.getContentLength();
        if (contentLength > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Image size too large: " + contentLength + " bytes");
        }

        try (InputStream inputStream = connection.getInputStream()) {
            BufferedImage image = ImageIO.read(inputStream);
            if (image == null) {
                throw new IllegalArgumentException("Cannot read image from URL: " + imageUrl);
            }
            return image;
        } finally {
            connection.disconnect();
        }
    }

    /**
     * 이미지 리사이징 (정사각형으로)
     * @param originalImage 원본 이미지
     * @param size 목표 크기 (가로 = 세로)
     * @return 리사이징된 이미지
     */
    private BufferedImage resizeImage(BufferedImage originalImage, int size) throws Exception {
        return Thumbnails.of(originalImage)
                .size(size, size)
                .asBufferedImage();
    }

    /**
     * 기본 프로필 이미지 URL 반환
     * @return 기본 프로필 이미지의 CloudFront URL
     */
    public String getDefaultProfileImageUrl() {
        // 기본 이미지가 S3에 업로드되어 있다고 가정
        return cdnBaseUrl + "/" + defaultImagePath;
    }

    /**
     * 애플리케이션 시작 시 기본 프로필 이미지를 S3에 업로드
     * (이미 존재하는 경우 스킵)
     */
    public void uploadDefaultProfileImageIfNotExists() {
        try {
            // 리소스에서 기본 이미지 로드
            ClassPathResource resource = new ClassPathResource(defaultImagePath);
            if (!resource.exists()) {
                log.warn("Default profile image not found in resources: {}", defaultImagePath);
                return;
            }

            // S3에 업로드 (기존 파일이 있어도 덮어쓰기)
            try (InputStream inputStream = resource.getInputStream()) {
                String fileName = defaultImagePath.substring(defaultImagePath.lastIndexOf('/') + 1);
                String filePath = defaultImagePath.substring(0, defaultImagePath.lastIndexOf('/'));
                s3Service.uploadFile(inputStream, "image/png", filePath, fileName);
                log.info("Default profile image uploaded to S3: {}", defaultImagePath);
            }
        } catch (Exception e) {
            log.error("Failed to upload default profile image", e);
        }
    }
}
