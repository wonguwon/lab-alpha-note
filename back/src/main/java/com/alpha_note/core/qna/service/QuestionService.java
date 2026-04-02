package com.alpha_note.core.qna.service;

import com.alpha_note.core.common.entity.Tag;
import com.alpha_note.core.common.exception.CustomException;
import com.alpha_note.core.common.exception.ErrorCode;
import com.alpha_note.core.common.repository.TagRepository;
import com.alpha_note.core.qna.dto.request.CreateQuestionRequest;
import com.alpha_note.core.qna.dto.request.UpdateQuestionRequest;
import com.alpha_note.core.qna.dto.response.*;
import com.alpha_note.core.qna.entity.*;
import com.alpha_note.core.qna.enums.QuestionCategory;
import com.alpha_note.core.qna.enums.SearchType;
import com.alpha_note.core.notification.enums.NotificationType;
import com.alpha_note.core.notification.service.NotificationService;
import com.alpha_note.core.qna.repository.*;
import com.alpha_note.core.user.entity.User;
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
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionTagRepository questionTagRepository;
    private final QuestionCommentRepository questionCommentRepository;
    private final QuestionVoteRepository questionVoteRepository;
    private final TagRepository tagRepository;
    private final AnswerRepository answerRepository;
    private final AnswerCommentRepository answerCommentRepository;
    private final AnswerVoteRepository answerVoteRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ViewCountService viewCountService;

    /**
     * 질문 생성
     */
    @Transactional
    public QuestionDetailResponse createQuestion(Long userId, CreateQuestionRequest request) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 질문 생성
        Question question = Question.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .build();

        Question savedQuestion = questionRepository.save(question);
        log.info("질문 생성 완료 - questionId: {}, userId: {}", savedQuestion.getId(), userId);

        // 태그 처리
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            if (request.getTags().size() > 5) {
                throw new CustomException(ErrorCode.MAX_TAGS_EXCEEDED);
            }
            attachTagsToQuestion(savedQuestion.getId(), request.getTags());
        }

        return getQuestionDetail(savedQuestion.getId(), userId);
    }

    /**
     * 질문 상세 조회 (조회수 증가 - 중복 방지)
     */
    @Transactional
    public QuestionDetailResponse getQuestionDetail(Long questionId, Long currentUserId) {
        Question question = questionRepository.findByIdAndIsDeletedFalse(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // 조회수 증가 (로그인 사용자만, 중복 방지)
        if (currentUserId != null && !viewCountService.hasViewed(questionId, currentUserId)) {
            question.incrementViewCount();
            viewCountService.recordView(questionId, currentUserId);
            questionRepository.save(question);
            log.debug("질문 조회수 증가 - questionId: {}, userId: {}", questionId, currentUserId);
        }

        return buildQuestionDetailResponse(question, currentUserId);
    }

    /**
     * 질문 목록 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<QuestionResponse> getQuestions(Pageable pageable, Long currentUserId) {
        Page<Question> questions = questionRepository.findAllByIsDeletedFalse(pageable);
        return questions.map(q -> buildQuestionResponse(q, currentUserId));
    }

    /**
     * 질문 검색 (키워드 + 검색 타입 + 카테고리 필터)
     */
    @Transactional(readOnly = true)
    public Page<QuestionResponse> searchQuestions(String keyword, SearchType searchType, QuestionCategory category, Pageable pageable, Long currentUserId) {
        Page<Question> questions;

        if (category != null) {
            switch (searchType) {
                case TITLE:
                    questions = questionRepository.searchByTitleAndCategory(keyword, category, pageable);
                    break;
                case CONTENT:
                    questions = questionRepository.searchByContentAndCategory(keyword, category, pageable);
                    break;
                case AUTHOR:
                    questions = questionRepository.searchByAuthorAndCategory(keyword, category, pageable);
                    break;
                case ALL:
                default:
                    questions = questionRepository.searchByKeywordAndCategory(keyword, category, pageable);
                    break;
            }
        } else {
            switch (searchType) {
                case TITLE:
                    questions = questionRepository.searchByTitle(keyword, pageable);
                    break;
                case CONTENT:
                    questions = questionRepository.searchByContent(keyword, pageable);
                    break;
                case AUTHOR:
                    questions = questionRepository.searchByAuthor(keyword, pageable);
                    break;
                case ALL:
                default:
                    questions = questionRepository.searchByKeyword(keyword, pageable);
                    break;
            }
        }

        return questions.map(q -> buildQuestionResponse(q, currentUserId));
    }

    /**
     * 태그별 질문 조회
     */
    @Transactional(readOnly = true)
    public Page<QuestionResponse> getQuestionsByTag(String tagName, Pageable pageable, Long currentUserId) {
        Page<Question> questions = questionRepository.findByTagName(tagName, pageable);
        return questions.map(q -> buildQuestionResponse(q, currentUserId));
    }

    /**
     * 사용자별 질문 조회 (카테고리 필터 지원)
     */
    @Transactional(readOnly = true)
    public Page<QuestionResponse> getQuestionsByUser(Long userId, QuestionCategory category, Pageable pageable, Long currentUserId) {
        Page<Question> questions;
        if (category != null) {
            questions = questionRepository.findByUser_IdAndCategoryAndIsDeletedFalse(userId, category, pageable);
        } else {
            questions = questionRepository.findByUser_IdAndIsDeletedFalse(userId, pageable);
        }
        return questions.map(q -> buildQuestionResponse(q, currentUserId));
    }

    /**
     * 미답변 질문 조회
     */
    @Transactional(readOnly = true)
    public Page<QuestionResponse> getUnansweredQuestions(Pageable pageable, Long currentUserId) {
        Page<Question> questions = questionRepository.findByIsAnsweredAndIsDeletedFalseOrderByCreatedAtDesc(false, pageable);
        return questions.map(q -> buildQuestionResponse(q, currentUserId));
    }

    /**
     * 카테고리별 질문 조회
     */
    @Transactional(readOnly = true)
    public Page<QuestionResponse> getQuestionsByCategory(QuestionCategory category, Pageable pageable, Long currentUserId) {
        Page<Question> questions = questionRepository.findByCategoryAndIsDeletedFalse(category, pageable);
        return questions.map(q -> buildQuestionResponse(q, currentUserId));
    }

    /**
     * 질문 수정
     */
    @Transactional
    public QuestionDetailResponse updateQuestion(Long questionId, Long userId, UpdateQuestionRequest request) {
        Question question = questionRepository.findByIdAndIsDeletedFalse(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // 작성자 확인
        if (!question.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.QUESTION_ACCESS_DENIED);
        }

        // 질문 업데이트
        question.update(request.getTitle(), request.getContent(), request.getCategory());
        questionRepository.save(question);

        // 태그 업데이트
        if (request.getTags() != null) {
            if (request.getTags().size() > 5) {
                throw new CustomException(ErrorCode.MAX_TAGS_EXCEEDED);
            }
            // 기존 태그 제거
            questionTagRepository.deleteByQuestionId(questionId);
            // 새 태그 추가
            if (!request.getTags().isEmpty()) {
                attachTagsToQuestion(questionId, request.getTags());
            }
        }

        log.info("질문 수정 완료 - questionId: {}", questionId);
        return getQuestionDetail(questionId, userId);
    }

    /**
     * 질문 삭제 (Soft Delete)
     */
    @Transactional
    public void deleteQuestion(Long questionId, Long userId) {
        Question question = questionRepository.findByIdAndIsDeletedFalse(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // 작성자 확인
        if (!question.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.QUESTION_ACCESS_DENIED);
        }

        // Soft Delete
        question.markAsDeleted();
        questionRepository.save(question);

        // 연관 엔티티도 Soft Delete (Service에서 처리)
        softDeleteRelatedEntities(questionId);

        log.info("질문 삭제 완료 - questionId: {}", questionId);
    }

    /**
     * 답변 채택
     */
    @Transactional
    public void acceptAnswer(Long questionId, Long answerId, Long userId) {
        Question question = questionRepository.findByIdAndIsDeletedFalse(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        // 질문 작성자만 채택 가능
        if (!question.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.ONLY_QUESTION_AUTHOR_CAN_ACCEPT);
        }

        // 답변 검증
        Answer answer = answerRepository.findByIdAndIsDeletedFalse(answerId)
                .orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

        // 해당 질문의 답변인지 확인
        if (!answer.getQuestionId().equals(questionId)) {
            throw new CustomException(ErrorCode.INVALID_ACCEPTED_ANSWER);
        }

        // 기존 채택 답변 취소
        if (question.hasAcceptedAnswer()) {
            Answer previousAccepted = answerRepository.findById(question.getAcceptedAnswerId())
                    .orElse(null);
            if (previousAccepted != null) {
                previousAccepted.unmarkAsAccepted();
                answerRepository.save(previousAccepted);
            }
        }

        // 새 답변 채택
        question.acceptAnswer(answerId);
        answer.markAsAccepted();

        questionRepository.save(question);
        answerRepository.save(answer);

        // 알림 생성 (답변 작성자에게)
        notificationService.createNotification(
                answer.getUserId(),
                NotificationType.ANSWER_ACCEPTED,
                NotificationType.ANSWER_ACCEPTED.getTitle(),
                String.format("질문 '%s'에서 답변이 채택되었습니다.", question.getTitle()),
                "ANSWER",
                answerId
        );

        log.info("답변 채택 완료 - questionId: {}, answerId: {}", questionId, answerId);
    }

    // ========== Private Helper 메소드 ==========

    /**
     * 태그 연결
     */
    private void attachTagsToQuestion(Long questionId, List<String> tagNames) {
        for (String tagName : tagNames) {
            final String normalizedTagName = tagName.trim().toLowerCase();
            if (normalizedTagName.isEmpty()) continue;

            // 태그 조회 또는 생성
            Tag tag = tagRepository.findByNameAndIsDeletedFalse(normalizedTagName)
                    .orElseGet(() -> {
                        Tag newTag = Tag.builder()
                                .name(normalizedTagName)
                                .build();
                        return tagRepository.save(newTag);
                    });

            // 중복 체크
            if (!questionTagRepository.existsByQuestionIdAndTagId(questionId, tag.getId())) {
                QuestionTag questionTag = QuestionTag.builder()
                        .questionId(questionId)
                        .tagId(tag.getId())
                        .build();
                questionTagRepository.save(questionTag);

                // 태그 사용 횟수 증가
                tag.incrementUseCount();
                tagRepository.save(tag);
            }
        }
    }

    /**
     * 연관 엔티티 Soft Delete
     */
    private void softDeleteRelatedEntities(Long questionId) {
        // 답변들 Soft Delete
        List<Answer> answers = answerRepository.findByQuestionEntity_IdAndIsDeletedFalse(questionId);
        answers.forEach(answer -> {
            answer.markAsDeleted();
            answerRepository.save(answer);
        });

        // 댓글들 Soft Delete
        List<QuestionComment> comments = questionCommentRepository.findByQuestionEntity_Id(questionId);
        comments.forEach(comment -> {
            comment.markAsDeleted();
            questionCommentRepository.save(comment);
        });
    }

    /**
     * QuestionResponse 빌드 (목록용)
     */
    private QuestionResponse buildQuestionResponse(Question question, Long currentUserId) {
        QuestionResponse response = QuestionResponse.from(question);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(question.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        // 태그 목록
        List<QuestionTag> questionTags = questionTagRepository.findByQuestionId(question.getId());
        List<TagResponse> tags = questionTags.stream()
                .map(qt -> tagRepository.findByIdAndIsDeletedFalse(qt.getTagId()))
                .filter(opt -> opt.isPresent())
                .map(opt -> TagResponse.from(opt.get()))
                .collect(Collectors.toList());
        response.setTags(tags);

        return response;
    }

    /**
     * QuestionDetailResponse 빌드 (상세용)
     */
    private QuestionDetailResponse buildQuestionDetailResponse(Question question, Long currentUserId) {
        QuestionDetailResponse response = QuestionDetailResponse.from(question);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(question.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        // 추천 여부 (현재 사용자)
        if (currentUserId != null) {
            boolean isVoted = questionVoteRepository.existsByQuestionEntity_IdAndUser_Id(question.getId(), currentUserId);
            response.setIsVotedByCurrentUser(isVoted);
        }

        // 태그 목록
        List<QuestionTag> questionTags = questionTagRepository.findByQuestionId(question.getId());
        List<TagResponse> tags = questionTags.stream()
                .map(qt -> tagRepository.findByIdAndIsDeletedFalse(qt.getTagId()))
                .filter(opt -> opt.isPresent())
                .map(opt -> TagResponse.from(opt.get()))
                .collect(Collectors.toList());
        response.setTags(tags);

        // 댓글 개수
        long commentCount = questionCommentRepository.countByQuestionEntity_IdAndIsDeletedFalse(question.getId());
        response.setCommentCount((int) commentCount);

        // 답변 목록 (채택 답변 우선 정렬)
        List<Answer> answers = answerRepository.findByQuestionIdOrderByAcceptedAndVotes(question.getId());
        List<AnswerResponse> answerResponses = answers.stream()
                .map(answer -> buildAnswerResponse(answer, currentUserId))
                .collect(Collectors.toList());
        response.setAnswers(answerResponses);

        return response;
    }

    /**
     * AnswerResponse 빌드
     */
    private AnswerResponse buildAnswerResponse(Answer answer, Long currentUserId) {
        AnswerResponse response = AnswerResponse.from(answer);

        // 작성자 닉네임 및 프로필 이미지
        userRepository.findById(answer.getUserId()).ifPresent(user -> {
            response.setUserNickname(user.getNickname());
            response.setProfileImageUrl(user.getProfileImageUrl());
        });

        // 추천 여부
        if (currentUserId != null) {
            boolean isVoted = answerVoteRepository.existsByAnswerEntity_IdAndUser_Id(answer.getId(), currentUserId);
            response.setIsVotedByCurrentUser(isVoted);
        }

        // 댓글 개수
        long commentCount = answerCommentRepository.countByAnswerEntity_IdAndIsDeletedFalse(answer.getId());
        response.setCommentCount((int) commentCount);

        return response;
    }
}
