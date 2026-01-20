package com.alpha_note.core.blog.service;

import com.alpha_note.core.blog.entity.BlogView;
import com.alpha_note.core.blog.entity.BlogViewId;
import com.alpha_note.core.blog.repository.BlogViewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 블로그 조회수 추적 서비스
 * - blog_views 테이블에 조회 기록 저장
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BlogViewCountService {

    private final BlogViewRepository blogViewRepository;

    /**
     * 사용자가 특정 블로그를 이미 조회했는지 확인
     */
    @Transactional(readOnly = true)
    public boolean hasViewed(Long blogId, Long userId) {
        return blogViewRepository.existsByIdBlogIdAndIdUserId(blogId, userId);
    }

    /**
     * 사용자의 블로그 조회 기록 저장
     */
    @Transactional
    public void recordView(Long blogId, Long userId) {
        // 이미 조회 기록이 있으면 저장하지 않음 (중복 방지)
        BlogViewId viewId = new BlogViewId(blogId, userId);

        if (!blogViewRepository.existsById(viewId)) {
            BlogView view = BlogView.of(blogId, userId);
            blogViewRepository.save(view);
            log.debug("블로그 조회 기록 저장 - blogId = {}, userId = {}", blogId, userId);
        }
    }
}
