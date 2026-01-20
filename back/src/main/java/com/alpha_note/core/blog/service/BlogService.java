package com.alpha_note.core.blog.service;

import com.alpha_note.core.blog.dto.response.BlogTagResponse;
import com.alpha_note.core.blog.enums.BlogSearchType;
import com.alpha_note.core.blog.dto.request.CreateBlogRequest;
import com.alpha_note.core.blog.dto.request.UpdateBlogRequest;
import com.alpha_note.core.blog.dto.response.BlogDetailResponse;
import com.alpha_note.core.blog.dto.response.BlogResponse;
import com.alpha_note.core.blog.entity.Blog;
import com.alpha_note.core.blog.entity.BlogComment;
import com.alpha_note.core.blog.entity.BlogTag;
import com.alpha_note.core.blog.repository.BlogCommentRepository;
import com.alpha_note.core.blog.repository.BlogRepository;
import com.alpha_note.core.blog.repository.BlogTagRepository;
import com.alpha_note.core.blog.repository.BlogVoteRepository;
import com.alpha_note.core.common.entity.Tag;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.common.repository.TagRepository;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final BlogTagRepository blogTagRepository;
    private final BlogVoteRepository blogVoteRepository;
    private final BlogCommentRepository blogCommentRepository;
    private final BlogViewCountService viewCountService;

    /**
     * 블로그 목록 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<BlogResponse> getBlogs(Pageable pageable, Long currentUserId) {
        Page<Blog> blogs = blogRepository.findAllByIsDeletedFalse(pageable);
        return blogs.map(q -> buildBlogResponse(q, currentUserId));
    }

    /**
     * 블로그 목록 조회 (페이징, 피드만)
     */
    @Transactional(readOnly = true)
    public Page<BlogResponse> getFeedBlogs(Pageable pageable, Long currentUserId) {
        Page<Blog> blogs = blogRepository.findAllWithVotesByUserId(currentUserId, pageable);
        return blogs.map(q -> buildBlogResponse(q, currentUserId));
    }

    /**
     * 블로그 생성
     */
    @Transactional
    public BlogDetailResponse createBlog(Long userId, CreateBlogRequest request) {
        // 사용자 검증
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 질문 생성
        Blog blog = Blog.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .thumbnailUrl(request.getThumbnailUrl())
                .build();

        Blog savedBlog = blogRepository.save(blog);
        log.info("블로그 생성 완료 - blogId: {}, userId: {}", savedBlog.getId(), userId);

        // 태그 처리
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            if (request.getTags().size() > 5) {
                throw new CustomException(ErrorCode.MAX_TAGS_EXCEEDED);
            }
            attachTagsToBlog(savedBlog.getId(), request.getTags());
        }

        return getBlogDetail(savedBlog.getId(), userId);
    }

    /**
     * 블로그 상세 조회 (조회수 증가 - 중복 방지)
     */
    @Transactional
    public BlogDetailResponse getBlogDetail(Long blogId, Long currentUserId) {
        Blog blog = blogRepository.findByIdAndIsDeletedFalse(blogId)
                .orElseThrow(() -> new CustomException(ErrorCode.BLOG_NOT_FOUND));

        // 조회수 증가 (로그인 사용자만, 중복 방지)
        if (currentUserId != null && !viewCountService.hasViewed(blogId, currentUserId)) {
            blog.incrementViewCount();
            viewCountService.recordView(blogId, currentUserId);
            blogRepository.save(blog);
            log.debug("블로그 조회수 증가 - blogId: {}, userId: {}", blogId, currentUserId);
        }

        return buildBlogDetailResponse(blog, currentUserId);
    }

    /**
     * 블로그 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteBlog(Long blogId, Long userId) {
        Blog blog = blogRepository.findByIdAndIsDeletedFalse(blogId)
                .orElseThrow(() -> new CustomException(ErrorCode.BLOG_NOT_FOUND));

        // 작성자 확인
        if (!blog.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.BLOG_ACCESS_DENIED);
        }

        // Soft Delete
        blog.markAsDeleted();
        blogRepository.save(blog);

        // 연관 엔티티도 Soft Delete (Service에서 처리)
        softDeleteRelatedEntities(blogId);

        log.info("블로그 삭제 완료 - blogId: {}", blogId);
    }

    /**
     * 블로그 수정
     */
    @Transactional
    public BlogDetailResponse updateBlog(Long blogId, Long userId, UpdateBlogRequest request) {
        Blog blog = blogRepository.findByIdAndIsDeletedFalse(blogId)
                .orElseThrow(() -> new CustomException(ErrorCode.BLOG_NOT_FOUND));

        // 작성자 확인
        if (!blog.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.BLOG_ACCESS_DENIED);
        }

        // 블로그 업데이트
        blog.update(request.getTitle(), request.getContent(), request.getThumbnailUrl());
        blogRepository.save(blog);

        // 태그 업데이트
        if (request.getTags() != null) {
            if (request.getTags().size() > 5) {
                throw new CustomException(ErrorCode.MAX_TAGS_EXCEEDED);
            }
            // 기존 태그 제거
            blogTagRepository.deleteByBlogId(blogId);
            // 새 태그 추가
            if (!request.getTags().isEmpty()) {
                attachTagsToBlog(blogId, request.getTags());
            }
        }

        log.info("블로그 수정 완료 - blogId: {}", blogId);
        return getBlogDetail(blogId, userId);
    }

    /**
     * 블로그 검색 (키워드 + 검색 타입)
     */
    @Transactional(readOnly = true)
    public Page<BlogResponse> searchBlogs(String keyword, BlogSearchType searchType, Pageable pageable, Long currentUserId) {
        Page<Blog> blogs;

        switch (searchType) {
            case CONTENT:
                blogs = blogRepository.searchByContent(keyword, pageable);
                break;
            case AUTHOR:
                blogs = blogRepository.searchByAuthor(keyword, pageable);
                break;
            case TAG:
                blogs = blogRepository.searchByTag(keyword, pageable);
                break;
            case TITLE:
            default:
                blogs = blogRepository.searchByTitle(keyword, pageable);
                break;
        }

        return blogs.map(b -> buildBlogResponse(b, currentUserId));
    }

    /**
     * 피드 블로그 검색 (키워드 + 검색 타입)
     */
    @Transactional(readOnly = true)
    public Page<BlogResponse> searchFeedBlogs(String keyword, BlogSearchType searchType, Pageable pageable, Long currentUserId) {
        Page<Blog> blogs;

        switch (searchType) {
            case CONTENT:
                blogs = blogRepository.searchWithVotesByContent(keyword, currentUserId, pageable);
                break;
            case AUTHOR:
                blogs = blogRepository.searchWithVotesByAuthor(keyword, currentUserId, pageable);
                break;
            case TAG:
                blogs = blogRepository.searchWithVotesByTag(keyword, currentUserId, pageable);
                break;
            case TITLE:
            default:
                blogs = blogRepository.searchWithVotesByTitle(keyword, currentUserId, pageable);
                break;
        }

        return blogs.map(b -> buildBlogResponse(b, currentUserId));
    }

    // ========== Private Helper 메소드 ==========

    /**
     * 태그 연결
     */
    private void attachTagsToBlog(Long blogId, List<String> tagNames) {
        for (String tagName : tagNames) {
            final String normalizedTagName = tagName.trim().toLowerCase();
            if (normalizedTagName.isEmpty()) continue;

            // 태그 조회 또는 생성
            Tag tag = tagRepository.findByNameAndIsDeletedFalse(normalizedTagName)
                    .orElseGet(() -> {
                        Tag newTag = Tag.builder()
                                .name(normalizedTagName)
                                .build();
                        return tagRepository.save(newTag);
                    });

            // 중복 체크
            if (!blogTagRepository.existsByBlogIdAndTagId(blogId, tag.getId())) {
                BlogTag blogTag = BlogTag.builder()
                        .blogId(blogId)
                        .tagId(tag.getId())
                        .build();
                blogTagRepository.save(blogTag);

                // 태그 사용 횟수 증가
                tag.incrementUseCount();
                tagRepository.save(tag);
            }
        }
    }

    /**
     * BlogDetailResponse 빌드 (상세용)
     */
    private BlogDetailResponse buildBlogDetailResponse(Blog blog, Long currentUserId) {
        BlogDetailResponse response = BlogDetailResponse.from(blog);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(blog.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        // 추천 여부 (현재 사용자)
        if (currentUserId != null) {
            boolean isVoted = blogVoteRepository.existsByBlogIdAndUserId(blog.getId(), currentUserId);
            response.setIsVotedByCurrentUser(isVoted);
        }

        // 태그 목록
        List<BlogTag> blogTags = blogTagRepository.findByBlogId(blog.getId());
        List<BlogTagResponse> tags = blogTags.stream()
                .map(qt -> tagRepository.findByIdAndIsDeletedFalse(qt.getTagId()))
                .filter(opt -> opt.isPresent())
                .map(opt -> BlogTagResponse.from(opt.get()))
                .collect(Collectors.toList());
        response.setTags(tags);

        // 댓글 개수
        long commentCount = blogCommentRepository.countByBlogIdAndIsDeletedFalse(blog.getId());
        response.setCommentCount((int) commentCount);

        return response;
    }

    /**
     * 연관 엔티티 Soft Delete
     */
    private void softDeleteRelatedEntities(Long blogId) {
        // 댓글들 Soft Delete
        List<BlogComment> comments = blogCommentRepository.findByBlogId(blogId);
        comments.forEach(comment -> {
            comment.markAsDeleted();
            blogCommentRepository.save(comment);
        });
    }

    /**
     * BlogResponse 빌드 (목록용)
     */
    private BlogResponse buildBlogResponse(Blog blog, Long currentUserId) {
        BlogResponse response = BlogResponse.from(blog);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(blog.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
        });

        // 태그 목록
        List<BlogTag> questionTags = blogTagRepository.findByBlogId(blog.getId());
        List<BlogTagResponse> tags = questionTags.stream()
                .map(qt -> tagRepository.findByIdAndIsDeletedFalse(qt.getTagId()))
                .filter(opt -> opt.isPresent())
                .map(opt -> BlogTagResponse.from(opt.get()))
                .collect(Collectors.toList());
        response.setTags(tags);

        return response;
    }
}
