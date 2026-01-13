package com.alpha_note.core.blog.controller;

import com.alpha_note.core.blog.dto.response.BlogResponse;
import com.alpha_note.core.blog.service.BlogService;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    /**
     * 블로그 목록 조회 (페이징)
     * GET /api/v1/blogs
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BlogResponse>>> getBlogs(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = (user != null) ? user.getId() : null;

        Page<BlogResponse> response = blogService.getBlogs(pageable, userId);

        return ResponseEntity.ok(ApiResponse.success("블로그 목록 조회 성공", response));
    }
}
