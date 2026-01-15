package com.alpha_note.core.blog.repository;

import com.alpha_note.core.blog.entity.BlogTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogTagRepository extends JpaRepository<BlogTag, Long> {

    // 블로그별 태그 조회
    List<BlogTag> findByBlogId(Long blogId);

    // 존재 여부
    boolean existsByBlogIdAndTagId(Long blogId, Long tagId);

    // 블로그별 모든 태그 삭제
    @Modifying
    @Query("DELETE FROM BlogTag bt WHERE bt.blogId = :blogId")
    void deleteByBlogId(@Param("blogId") Long blogId);
}
