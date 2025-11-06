package com.alpha_note.core.user.repository;

import com.alpha_note.core.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 기존 메서드 (활성/삭제 계정 모두 조회)
    Optional<User> findByEmail(String email);
    Optional<User> findByNickname(String nickname);
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);

    // 활성 계정만 조회 (isDeleted = false)
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    Optional<User> findByNicknameAndIsDeletedFalse(String nickname);
    boolean existsByEmailAndIsDeletedFalse(String email);
    boolean existsByNicknameAndIsDeletedFalse(String nickname);

    // 삭제된 계정 조회 (isDeleted = true)
    List<User> findAllByEmailAndIsDeletedTrue(String email);
    List<User> findAllByNicknameAndIsDeletedTrue(String nickname);

    // 삭제 예정인 계정 조회 (스케줄러용)
    List<User> findAllByIsDeletedTrueAndDeletionScheduledAtBefore(Instant now);
}
