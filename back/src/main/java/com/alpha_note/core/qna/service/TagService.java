package com.alpha_note.core.qna.service;

import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.qna.dto.response.TagResponse;
import com.alpha_note.core.common.entity.Tag;
import com.alpha_note.core.common.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    /**
     * 모든 태그 조회
     */
    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        List<Tag> tags = tagRepository.findAllByIsDeletedFalse();
        return tags.stream()
                .map(TagResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 인기 태그 조회 (사용 횟수 Top 10)
     */
    @Transactional(readOnly = true)
    public List<TagResponse> getPopularTags() {
        List<Tag> tags = tagRepository.findTop10ByIsDeletedFalseOrderByUseCountDesc();
        return tags.stream()
                .map(TagResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 태그 검색 (이름으로)
     */
    @Transactional(readOnly = true)
    public List<TagResponse> searchTags(String keyword) {
        List<Tag> tags = tagRepository.findByNameContainingAndIsDeletedFalse(keyword);
        return tags.stream()
                .map(TagResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 태그 상세 조회
     */
    @Transactional(readOnly = true)
    public TagResponse getTag(Long tagId) {
        Tag tag = tagRepository.findByIdAndIsDeletedFalse(tagId)
                .orElseThrow(() -> new CustomException(ErrorCode.TAG_NOT_FOUND));
        return TagResponse.from(tag);
    }

    /**
     * 태그 이름으로 조회
     */
    @Transactional(readOnly = true)
    public TagResponse getTagByName(String name) {
        Tag tag = tagRepository.findByNameAndIsDeletedFalse(name)
                .orElseThrow(() -> new CustomException(ErrorCode.TAG_NOT_FOUND));
        return TagResponse.from(tag);
    }

    /**
     * 태그 생성 (관리자 전용 - 향후 권한 체크 추가)
     */
    @Transactional
    public TagResponse createTag(String name, String description) {
        // 중복 체크
        if (tagRepository.existsByNameAndIsDeletedFalse(name)) {
            throw new CustomException(ErrorCode.TAG_ALREADY_EXISTS);
        }

        Tag tag = Tag.builder()
                .name(name.trim().toLowerCase())
                .description(description)
                .build();

        Tag savedTag = tagRepository.save(tag);
        log.info("태그 생성 완료 - tagId: {}, name: {}", savedTag.getId(), savedTag.getName());

        return TagResponse.from(savedTag);
    }

    /**
     * 태그 설명 업데이트 (관리자 전용 - 향후 권한 체크 추가)
     */
    @Transactional
    public TagResponse updateTag(Long tagId, String description) {
        Tag tag = tagRepository.findByIdAndIsDeletedFalse(tagId)
                .orElseThrow(() -> new CustomException(ErrorCode.TAG_NOT_FOUND));

        tag.updateDescription(description);
        Tag updatedTag = tagRepository.save(tag);

        log.info("태그 업데이트 완료 - tagId: {}", tagId);

        return TagResponse.from(updatedTag);
    }

    /**
     * 태그 삭제 (Soft Delete, 관리자 전용 - 향후 권한 체크 추가)
     */
    @Transactional
    public void deleteTag(Long tagId) {
        Tag tag = tagRepository.findByIdAndIsDeletedFalse(tagId)
                .orElseThrow(() -> new CustomException(ErrorCode.TAG_NOT_FOUND));

        tag.markAsDeleted();
        tagRepository.save(tag);

        log.info("태그 삭제 완료 - tagId: {}, name: {}", tagId, tag.getName());
    }
}
