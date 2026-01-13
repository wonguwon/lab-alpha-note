package com.alpha_note.core.blog.repository;

import com.alpha_note.core.blog.entity.BlogTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogTagRepository extends JpaRepository<BlogTag, Long> {

    // 블로그별 태그 조회
    List<BlogTag> findByBlogId(Long blogId);

}
