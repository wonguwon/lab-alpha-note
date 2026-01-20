package com.alpha_note.core.common.repository;

import com.alpha_note.core.common.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    // 기본 조회 (모든 태그)
    Optional<Tag> findByName(String name);
    boolean existsByName(String name);

    // 활성 태그만 조회 (isDeleted = false)
    Optional<Tag> findByIdAndIsDeletedFalse(Long id);
    Optional<Tag> findByNameAndIsDeletedFalse(String name);
    List<Tag> findAllByIsDeletedFalse();
    boolean existsByNameAndIsDeletedFalse(String name);

    // 인기 태그 조회 (사용 횟수 내림차순)
    List<Tag> findTop10ByIsDeletedFalseOrderByUseCountDesc();

    // 이름으로 검색 (Like)
    List<Tag> findByNameContainingAndIsDeletedFalse(String keyword);
}
