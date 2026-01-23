package com.alpha_note.core.blog.service;

import com.alpha_note.core.blog.dto.request.CreateBlogCommentRequest;
import com.alpha_note.core.blog.dto.response.BlogCommentResponse;
import com.alpha_note.core.blog.entity.BlogComment;
import com.alpha_note.core.blog.repository.BlogCommentRepository;
import com.alpha_note.core.blog.repository.BlogRepository;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlogCommentService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final BlogCommentRepository blogCommentRepository;

    /**
     * 블로그 댓글 작성
     */
    @Transactional
    public BlogCommentResponse createBlogComment(Long blogId, Long userId, CreateBlogCommentRequest request) {
        // 블로그 존재 확인
        if (!blogRepository.existsById(blogId)) {
            throw new CustomException(ErrorCode.BLOG_NOT_FOUND);
        }

        // 사용자 검증
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 댓글 생성
        BlogComment comment = BlogComment.builder()
                .blogId(blogId)
                .userId(userId)
                .content(request.getContent())
                .build();

        BlogComment savedComment = blogCommentRepository.save(comment);

        // 블로그의 마지막 활동 시간 업데이트
        blogRepository.findById(blogId).ifPresent(blog -> {
            blog.updateLastActivity();
            blogRepository.save(blog);
        });

        log.info("블로그 댓글 작성 완료 - commentId: {}, blogId: {}, userId: {}", savedComment.getId(), blogId, userId);

        return buildBlogBlogCommentResponse(savedComment);
    }

    /**
     * 블로그 댓글 목록 조회
     */
    @Transactional(readOnly = true)
    public List<BlogCommentResponse> getBlogComments(Long blogId) {
        if (!blogRepository.existsById(blogId)) {
            throw new CustomException(ErrorCode.BLOG_NOT_FOUND);
        }

        List<BlogComment> comments = blogCommentRepository.findByBlogIdAndIsDeletedFalseOrderByCreatedAtDesc(blogId);
        return comments.stream()
                .map(this::buildBlogBlogCommentResponse)
                .collect(Collectors.toList());
    }

    // ========== Private Helper 메소드 ==========

    /**
     * BlogComment -> BlogCommentResponse 변환
     */
    private BlogCommentResponse buildBlogBlogCommentResponse(BlogComment comment) {
        BlogCommentResponse response = BlogCommentResponse.from(comment);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(comment.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        return response;
    }
}
