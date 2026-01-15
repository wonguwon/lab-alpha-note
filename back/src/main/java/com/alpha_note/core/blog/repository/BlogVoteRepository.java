package com.alpha_note.core.blog.repository;

import com.alpha_note.core.blog.entity.BlogVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogVoteRepository extends JpaRepository<BlogVote, Long> {

    // 투표 존재 여부 (중복 체크)
    boolean existsByBlogIdAndUserId(Long blogId, Long userId);

}
