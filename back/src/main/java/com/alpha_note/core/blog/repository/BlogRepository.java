package com.alpha_note.core.blog.repository;

import com.alpha_note.core.blog.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    // 기본 조회
    Optional<Blog> findByIdAndIsDeletedFalse(Long id);

    // 전체 질문 페이징 조회 (활성만, 최신순)
    Page<Blog> findAllByIsDeletedFalse(Pageable pageable);

    // 제목만 검색
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% AND b.isDeleted = false")
    Page<Blog> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    // 내용만 검색
    @Query("SELECT b FROM Blog b WHERE b.content LIKE %:keyword% AND b.isDeleted = false")
    Page<Blog> searchByContent(@Param("keyword") String keyword, Pageable pageable);

    // 작성자 닉네임으로 검색
    @Query("SELECT DISTINCT b FROM Blog b JOIN User u ON b.userId = u.id WHERE u.nickname LIKE %:keyword% AND b.isDeleted = false")
    Page<Blog> searchByAuthor(@Param("keyword") String keyword, Pageable pageable);

    // 태그명으로 검색
    @Query("SELECT DISTINCT b FROM Blog b JOIN BlogTag bt ON b.id = bt.blogId JOIN Tag t ON bt.tagId = t.id " +
            "WHERE b.isDeleted = false and t.name = :keyword AND t.isDeleted = false")
    Page<Blog> searchByTag(@Param("keyword") String keyword, Pageable pageable);

    // 피드 목록 - 투표한 건만 검색
    @Query("SELECT DISTINCT b FROM Blog b JOIN BlogVote v ON b.id = v.blogId WHERE b.isDeleted = false and v.userId = :userId")
    Page<Blog> findAllWithVotesByUserId(Long userId, Pageable pageable);

    // 제목만 검색
    @Query("SELECT DISTINCT b FROM Blog b JOIN BlogVote v ON b.id = v.blogId " +
            "WHERE b.isDeleted = false and b.title LIKE %:keyword% AND v.userId = :userId")
    Page<Blog> searchWithVotesByTitle(@Param("keyword") String keyword, Long userId, Pageable pageable);

    // 내용만 검색
    @Query("SELECT DISTINCT b FROM Blog b JOIN BlogVote v ON b.id = v.blogId " +
            "WHERE b.isDeleted = false and b.content LIKE %:keyword% AND b.isDeleted = false AND v.userId = :userId")
    Page<Blog> searchWithVotesByContent(@Param("keyword") String keyword, Long userId, Pageable pageable);

    // 작성자 닉네임으로 검색
    @Query("SELECT DISTINCT b FROM Blog b JOIN User u ON b.userId = u.id JOIN BlogVote v ON b.id = v.blogId " +
            "WHERE b.isDeleted = false AND u.nickname LIKE %:keyword% AND v.userId = :userId")
    Page<Blog> searchWithVotesByAuthor(@Param("keyword") String keyword, Long userId, Pageable pageable);

    // 태그명으로 검색
    @Query("SELECT DISTINCT b FROM Blog b JOIN BlogTag bt ON b.id = bt.blogId JOIN Tag t ON bt.tagId = t.id JOIN BlogVote v ON b.id = v.blogId " +
            "WHERE b.isDeleted = false and t.name = :keyword AND t.isDeleted = false AND v.userId = :userId")
    Page<Blog> searchWithVotesByTag(@Param("keyword") String keyword, Long userId, Pageable pageable);
}
