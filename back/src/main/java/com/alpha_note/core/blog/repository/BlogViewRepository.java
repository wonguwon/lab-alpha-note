package com.alpha_note.core.blog.repository;

import com.alpha_note.core.blog.entity.BlogView;
import com.alpha_note.core.blog.entity.BlogViewId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogViewRepository extends JpaRepository<BlogView, BlogViewId> {

    /**
     * 특정 사용자가 특정 블로그를 조회한 적이 있는지 확인
     */
    boolean existsByIdBlogIdAndIdUserId(Long blogId, Long userId);
}
