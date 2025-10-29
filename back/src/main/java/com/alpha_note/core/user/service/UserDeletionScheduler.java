package com.alpha_note.core.user.service;

import com.alpha_note.core.user.entity.User;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * 회원 탈퇴 후 60일 경과한 계정을 자동으로 완전 삭제하는 스케줄러
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserDeletionScheduler {

    private final UserRepository userRepository;

    /**
     * 매일 새벽 2시에 실행
     * 탈퇴 신청 후 60일이 경과한 계정을 완전 삭제
     */
    @Scheduled(cron = "${app.user.deletion.scheduler-cron:0 0 2 * * *}")
    @Transactional
    public void deleteExpiredUsers() {
        log.info("Starting scheduled deletion of expired user accounts");

        Instant now = Instant.now();
        List<User> expiredUsers = userRepository.findAllByIsDeletedTrueAndDeletionScheduledAtBefore(now);

        if (expiredUsers.isEmpty()) {
            log.info("No expired user accounts to delete");
            return;
        }

        log.info("Found {} expired user accounts for permanent deletion", expiredUsers.size());

        for (User user : expiredUsers) {
            try {
                log.info("Permanently deleting user: id={}, email={}, deletedAt={}, scheduledAt={}",
                        user.getId(),
                        user.getEmail(),
                        user.getDeletedAt(),
                        user.getDeletionScheduledAt());

                // TODO: 연관된 데이터 처리 (노트, 댓글 등)
                // - 완전 삭제 또는 익명화 처리

                userRepository.delete(user);
                log.info("Successfully deleted user: id={}", user.getId());

            } catch (Exception e) {
                log.error("Failed to delete user: id={}, email={}",
                        user.getId(), user.getEmail(), e);
            }
        }

        log.info("Completed deletion of {} expired user accounts", expiredUsers.size());
    }
}
