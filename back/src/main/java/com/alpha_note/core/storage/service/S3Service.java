package com.alpha_note.core.storage.service;

import com.alpha_note.core.common.util.FileUtils;
import com.alpha_note.core.storage.dto.PresignedUrlRequest;
import com.alpha_note.core.storage.dto.PresignedUrlResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.InputStream;
import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Presigner s3Presigner;
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.s3.cdnBaseUrl}")
    private String cdnBaseUrl;

    @Value("${cloud.aws.s3.presignMinutes}")
    private Integer presignMinutes;

    @Value("${cloud.aws.s3.allowedContentTypes}")
    private List<String> allowedContentTypes;

    public PresignedUrlResponse generatePresignedUrl(PresignedUrlRequest request) {
        // Validate content type
        if (!allowedContentTypes.contains(request.getContentType())) {
            throw new IllegalArgumentException("허용되지 않은 파일 형식입니다: " + request.getContentType());
        }

        // Generate unique file key
        String uniqueFileName = FileUtils.generateUniqueFileName(request.getFileName());
        String objectKey = request.getFilePath() + "/" + uniqueFileName;

        // Create PutObjectRequest
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(request.getContentType())
                .build();

        // Generate presigned URL
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(presignMinutes))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
        String presignedUrl = presignedRequest.url().toString();

        // Generate CDN URL
        String fileUrl = cdnBaseUrl + "/" + objectKey;

        log.info("Generated presigned URL for file: {}", objectKey);

        return PresignedUrlResponse.builder()
                .uploadUrl(presignedUrl)
                .fileUrl(fileUrl)
                .key(objectKey)
                .expiresIn((long) presignMinutes * 60)
                .build();
    }

    /**
     * InputStream을 받아서 직접 S3에 업로드
     * @param inputStream 업로드할 파일의 InputStream
     * @param contentType 파일의 Content-Type
     * @param filePath S3 경로 (예: "profiles")
     * @param fileName 파일명 (고유한 파일명이어야 함)
     * @return CloudFront CDN URL
     */
    public String uploadFile(InputStream inputStream, String contentType, String filePath, String fileName) {
        try {
            String objectKey = filePath + "/" + fileName;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, inputStream.available()));

            String fileUrl = cdnBaseUrl + "/" + objectKey;
            log.info("Successfully uploaded file to S3: {}", objectKey);

            return fileUrl;
        } catch (Exception e) {
            log.error("Failed to upload file to S3", e);
            throw new RuntimeException("파일 업로드에 실패했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * InputStream과 파일 크기를 받아서 직접 S3에 업로드
     * @param inputStream 업로드할 파일의 InputStream
     * @param contentLength 파일 크기 (바이트)
     * @param contentType 파일의 Content-Type
     * @param filePath S3 경로 (예: "profiles")
     * @param fileName 파일명 (고유한 파일명이어야 함)
     * @return CloudFront CDN URL
     */
    public String uploadFile(InputStream inputStream, long contentLength, String contentType, String filePath, String fileName) {
        try {
            String objectKey = filePath + "/" + fileName;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, contentLength));

            String fileUrl = cdnBaseUrl + "/" + objectKey;
            log.info("Successfully uploaded file to S3: {}", objectKey);

            return fileUrl;
        } catch (Exception e) {
            log.error("Failed to upload file to S3", e);
            throw new RuntimeException("파일 업로드에 실패했습니다: " + e.getMessage(), e);
        }
    }
}
