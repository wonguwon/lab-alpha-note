package com.alpha_note.core.blog.repository;

import com.alpha_note.core.blog.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    // 기본 조회
    Optional<Blog> findByIdAndIsDeletedFalse(Long id);

    // 전체 질문 페이징 조회 (활성만, 최신순)
    Page<Blog> findAllByIsDeletedFalseOrderByCreatedAtDesc(Pageable pageable);
}
