package com.alpha_note.core.blog.controller;

import com.alpha_note.core.blog.dto.request.CreateBlogRequest;
import com.alpha_note.core.blog.dto.request.UpdateBlogRequest;
import com.alpha_note.core.blog.dto.response.BlogDetailResponse;
import com.alpha_note.core.blog.dto.response.BlogResponse;
import com.alpha_note.core.blog.service.BlogService;
import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.qna.dto.request.CreateQuestionRequest;
import com.alpha_note.core.qna.dto.response.QuestionDetailResponse;
import com.alpha_note.core.qna.dto.response.QuestionResponse;
import com.alpha_note.core.qna.enums.SearchType;
import com.alpha_note.core.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    /**
     * 블로그 작성
     * POST /api/v1/blogs
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BlogDetailResponse>> createBlog(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateBlogRequest request) {

        BlogDetailResponse response = blogService.createBlog(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("블로그가 성공적으로 작성되었습니다.", response));
    }

    /**
     * 블로그 상세 조회
     * GET /api/v1/blogs/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDetailResponse>> getBlog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        Long userId = (user != null) ? user.getId() : null;
        BlogDetailResponse response = blogService.getBlogDetail(id, userId);
        return ResponseEntity.ok(ApiResponse.success("블로그 상세 조회 성공", response));
    }

    /**
     * 블로그 삭제 (Soft Delete)
     * DELETE /api/v1/blogs/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        blogService.deleteBlog(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("블로그가 성공적으로 삭제되었습니다.", null));
    }

    /**
     * 블로그 수정
     * PUT /api/v1/blogs/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDetailResponse>> updateBlog(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateBlogRequest request) {

        BlogDetailResponse response = blogService.updateBlog(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("블로그가 성공적으로 수정되었습니다.", response));
    }

    /**
     * 블로그 검색 (키워드 + 검색 타입)
     * GET /api/v1/blogs/search?keyword=...&searchType=TITLE
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<BlogResponse>>> searchBlogs(
            @AuthenticationPrincipal User user,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "ALL") SearchType searchType,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = (user != null) ? user.getId() : null;
        Page<BlogResponse> response = blogService.searchBlogs(keyword, searchType, pageable, userId);
        return ResponseEntity.ok(ApiResponse.success("블로그 검색 성공", response));
    }
}
