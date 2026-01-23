package com.alpha_note.core.blog.repository;

import com.alpha_note.core.blog.entity.BlogVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogVoteRepository extends JpaRepository<BlogVote, Long> {

    // 투표 존재 여부 (중복 체크)
    boolean existsByBlogIdAndUserId(Long blogId, Long userId);

    // 특정 투표 삭제
    @Modifying
    @Query("DELETE FROM BlogVote bv WHERE bv.blogId = :blogId AND bv.userId = :userId")
    void deleteByBlogIdAndUserId(@Param("blogId") Long blogId, @Param("userId") Long userId);
}
