package com.alpha_note.core.note.repository;

import com.alpha_note.core.note.entity.Note;
import com.alpha_note.core.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByAuthorOrderByUpdatedAtDesc(User author);
    Optional<Note> findByIdAndAuthor(Long id, User author);
    List<Note> findByTitleContainingIgnoreCaseAndAuthor(String title, User author);
}
