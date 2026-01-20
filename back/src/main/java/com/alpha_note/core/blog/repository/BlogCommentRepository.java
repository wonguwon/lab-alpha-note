package com.alpha_note.core.blog.repository;

import com.alpha_note.core.blog.entity.BlogComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogCommentRepository extends JpaRepository<BlogComment, Long> {

    // 댓글 수 카운트
    long countByBlogIdAndIsDeletedFalse(Long blogId);

    // 특정 블로그의 모든 댓글 조회 (삭제된 것 포함 - Soft Delete 처리용)
    List<BlogComment> findByBlogId(Long blogId);

    // 블로그별 댓글 조회 (생성일 내림차순 - 최신순)
    List<BlogComment> findByBlogIdAndIsDeletedFalseOrderByCreatedAtDesc(Long blogId);
}
