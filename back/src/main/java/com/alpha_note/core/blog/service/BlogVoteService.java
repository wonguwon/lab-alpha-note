package com.alpha_note.core.blog.service;

import com.alpha_note.core.blog.entity.Blog;
import com.alpha_note.core.blog.entity.BlogVote;
import com.alpha_note.core.blog.repository.BlogRepository;
import com.alpha_note.core.blog.repository.BlogVoteRepository;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlogVoteService {

    private final BlogRepository blogRepository;
    private final BlogVoteRepository blogVoteRepository;

    /**
     * 블로그 추천
     */
    @Transactional
    public void voteBlog(Long blogId, Long userId) {
        // 블로그 존재 확인
        Blog blog = blogRepository.findByIdAndIsDeletedFalse(blogId)
                .orElseThrow(() -> new CustomException(ErrorCode.BLOG_NOT_FOUND));

        // 중복 추천 체크
        if (blogVoteRepository.existsByBlogIdAndUserId(blogId, userId)) {
            throw new CustomException(ErrorCode.VOTE_ALREADY_EXISTS);
        }

        // 추천 생성
        BlogVote vote = BlogVote.builder()
                .blogId(blogId)
                .userId(userId)
                .build();
        blogVoteRepository.save(vote);

        // 추천 수 증가
        blog.incrementVoteCount();
        blogRepository.save(blog);

        log.info("블로그 추천 완료 - blogId: {}, userId: {}", blogId, userId);
    }

    /**
     * 블로그 추천 취소
     */
    @Transactional
    public void unvoteBlog(Long blogId, Long userId) {
        // 블로그 존재 확인
        Blog blog = blogRepository.findByIdAndIsDeletedFalse(blogId)
                .orElseThrow(() -> new CustomException(ErrorCode.BLOG_NOT_FOUND));

        // 추천 기록 확인
        if (!blogVoteRepository.existsByBlogIdAndUserId(blogId, userId)) {
            throw new CustomException(ErrorCode.VOTE_NOT_FOUND);
        }

        // 추천 삭제
        blogVoteRepository.deleteByBlogIdAndUserId(blogId, userId);

        // 추천 수 감소
        blog.decrementVoteCount();
        blogRepository.save(blog);

        log.info("블로그 추천 취소 완료 - blogId: {}, userId: {}", blogId, userId);
    }

    /**
     * 블로그 추천 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean isBlogVoted(Long blogId, Long userId) {
        return blogVoteRepository.existsByBlogIdAndUserId(blogId, userId);
    }
}
