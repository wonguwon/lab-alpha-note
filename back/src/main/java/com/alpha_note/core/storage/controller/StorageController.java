package com.alpha_note.core.storage.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.storage.dto.PresignedUrlRequest;
import com.alpha_note.core.storage.dto.PresignedUrlResponse;
import com.alpha_note.core.storage.service.S3Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/storage")
@RequiredArgsConstructor
public class StorageController {

    private final S3Service s3Service;

    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> generatePresignedUrl(
            @Valid @RequestBody PresignedUrlRequest request) {

        log.info("Generating presigned URL for file: {} at path: {}",
                request.getFileName(), request.getFilePath());

        PresignedUrlResponse response = s3Service.generatePresignedUrl(request);

        return ResponseEntity.ok(
                ApiResponse.success("Presigned URL이 성공적으로 생성되었습니다.", response));
    }
}
