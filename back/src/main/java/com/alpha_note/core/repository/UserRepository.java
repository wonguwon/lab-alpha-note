package com.alpha_note.core.repository;

import com.alpha_note.core.entity.AuthProvider;
import com.alpha_note.core.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
