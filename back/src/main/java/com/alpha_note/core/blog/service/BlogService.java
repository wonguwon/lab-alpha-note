package com.alpha_note.core.blog.service;

import com.alpha_note.core.blog.dto.response.BlogResponse;
import com.alpha_note.core.blog.entity.Blog;
import com.alpha_note.core.blog.entity.BlogTag;
import com.alpha_note.core.blog.repository.BlogRepository;
import com.alpha_note.core.blog.repository.BlogTagRepository;
import com.alpha_note.core.qna.dto.response.QuestionResponse;
import com.alpha_note.core.qna.dto.response.TagResponse;
import com.alpha_note.core.qna.entity.Question;
import com.alpha_note.core.qna.entity.QuestionTag;
import com.alpha_note.core.qna.repository.TagRepository;
import com.alpha_note.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final BlogTagRepository blogTagRepository;

    /**
     * 질문 목록 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<BlogResponse> getBlogs(Pageable pageable, Long currentUserId) {
        Page<Blog> blogs = blogRepository.findAllByIsDeletedFalseOrderByCreatedAtDesc(pageable);
        return blogs.map(q -> buildBLogResponse(q, currentUserId));
    }


    /**
     * BlogResponse 빌드 (목록용)
     */
    private BlogResponse buildBLogResponse(Blog blog, Long currentUserId) {
        BlogResponse response = BlogResponse.from(blog);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(blog.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
        });

        // 태그 목록
        List<BlogTag> questionTags = blogTagRepository.findByBlogId(blog.getId());
        List<TagResponse> tags = questionTags.stream()
                .map(qt -> tagRepository.findByIdAndIsDeletedFalse(qt.getTagId()))
                .filter(opt -> opt.isPresent())
                .map(opt -> TagResponse.from(opt.get()))
                .collect(Collectors.toList());
        response.setTags(tags);

        return response;
    }
}
