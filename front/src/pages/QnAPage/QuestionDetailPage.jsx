import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegCommentDots } from 'react-icons/fa';
import { BsPatchQuestion } from "react-icons/bs";
import { IoSend } from 'react-icons/io5';
import { qnaService } from '../../api/services';
import useAuthStore from '../../store/authStore';
import {
  DetailContainer,
  BackButton,
  QuestionCard,
  QuestionHeader,
  QuestionTitle,
  QuestionMeta,
  AuthorInfo,
  AuthorAvatar,
  AuthorName,
  MetaDivider,
  TimeStamp,
  Stats,
  StatItem,
  QuestionBody,
  QuestionContent,
  QuestionFooter,
  TagList,
  Tag,
  ActionBar,
  VoteSection,
  VoteButton,
  VoteCount,
  ActionButtons,
  ActionButton,
  CommentToggleButton,
  CommentSection,
  CommentList,
  CommentItem,
  CommentAuthor,
  CommentContent,
  CommentTime,
  CommentForm,
  CommentInput,
  CommentSubmitButton,
  Section,
  SectionHeader,
  SectionTitle,
  AnswerList,
  AnswerItem,
  AcceptedBadge,
  AnswerHeader,
  AnswerAuthor,
  AnswerContent,
  AnswerActions,
  FixedAnswerButton,
  EmptyState,
  LoadingState,
  CommentInputArea,
  CommentInputFooter,
  CharacterCount,
  SendIconButton,
} from './QuestionDetailPage.styled';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 댓글 토글 상태
  const [showQuestionComments, setShowQuestionComments] = useState(false);
  const [showAnswerComments, setShowAnswerComments] = useState({});

  // 댓글 입력 상태
  const [questionComment, setQuestionComment] = useState('');
  const [answerComments, setAnswerComments] = useState({});

  // 댓글 최대 글자수
  const MAX_COMMENT_LENGTH = 1000;

  // 데이터 로드
  useEffect(() => {
    loadQuestionDetail();
  }, [id]);

  const loadQuestionDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await qnaService.getQuestionDetail(id);
      setQuestion(data);
    } catch (err) {
      console.error('질문 상세 조회 실패:', err);
      setError(err.response?.data?.message || '질문을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 시간 포맷팅
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 투표 핸들러
  const handleVote = async (type, targetType, targetId) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // TODO: 투표 API 호출
    console.log(`Vote ${type} for ${targetType} ${targetId}`);
  };

  // 질문 댓글 토글
  const toggleQuestionComments = () => {
    setShowQuestionComments(!showQuestionComments);
  };

  // 답변 댓글 토글
  const toggleAnswerComments = (answerId) => {
    setShowAnswerComments({
      ...showAnswerComments,
      [answerId]: !showAnswerComments[answerId]
    });
  };

  // 질문 댓글 작성
  const handleQuestionCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!questionComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    // TODO: 댓글 작성 API 호출
    console.log('Create question comment:', questionComment);
    setQuestionComment('');
    // loadQuestionDetail(); // 새로고침
  };

  // 답변 댓글 작성
  const handleAnswerCommentSubmit = async (answerId, e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const comment = answerComments[answerId];
    if (!comment?.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    // TODO: 답변 댓글 작성 API 호출
    console.log(`Create answer comment for ${answerId}:`, comment);
    setAnswerComments({ ...answerComments, [answerId]: '' });
    // loadQuestionDetail(); // 새로고침
  };

  // 질문 수정
  const handleEditQuestion = () => {
    navigate(`/qna/${id}/edit`);
  };

  // 질문 삭제
  const handleDeleteQuestion = async () => {
    if (!window.confirm('정말로 이 질문을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await qnaService.deleteQuestion(id);
      alert('질문이 삭제되었습니다.');
      navigate('/qna');
    } catch (err) {
      console.error('질문 삭제 실패:', err);
      alert(err.response?.data?.message || '질문 삭제에 실패했습니다.');
    }
  };

  // 답변하기 페이지로 이동
  const handleAnswerClick = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate(`/qna/${id}/answer`);
  };

  // 로딩 상태
  if (loading) {
    return (
      <DetailContainer>
        <LoadingState>로딩 중...</LoadingState>
      </DetailContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <DetailContainer>
        <EmptyState>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
          <BackButton onClick={() => navigate('/qna')}>목록으로 돌아가기</BackButton>
        </EmptyState>
      </DetailContainer>
    );
  }

  // 데이터가 없는 경우
  if (!question) {
    return (
      <DetailContainer>
        <EmptyState>
          <h3>질문을 찾을 수 없습니다</h3>
          <BackButton onClick={() => navigate('/qna')}>목록으로 돌아가기</BackButton>
        </EmptyState>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      {/* 질문 카드 */}
      <QuestionCard>
        {/* 질문 헤더 */}
        <QuestionHeader>
          <QuestionTitle>
            <BsPatchQuestion color="#2563eb" size={38} style={{ paddingTop: '4px' }}/>
            {question.title}
          </QuestionTitle>
          <QuestionMeta>
            <AuthorInfo>
              {console.log(question)}
              <AuthorAvatar
                src={question?.profileImageUrl}
                alt={question?.userNickname}
              />
              <AuthorName>{question?.userNickname || '익명'}</AuthorName>
            </AuthorInfo>
            <MetaDivider>|</MetaDivider>
            <TimeStamp>{formatTimeAgo(question.createdAt)}</TimeStamp>
            <Stats>
              <StatItem>
                조회 <strong>{question.viewCount || 0}</strong>
              </StatItem>
              <StatItem>
                답변 <strong>{question.answerCount || 0}</strong>
              </StatItem>
              <StatItem>
                추천 <strong>{question.likeCount || 0}</strong>
              </StatItem>
            </Stats>
          </QuestionMeta>
        </QuestionHeader>

        {/* 질문 본문 */}
        <QuestionBody>
          <QuestionContent>{question.content}</QuestionContent>
        </QuestionBody>

        {/* 태그 */}
        {question.tags && question.tags.length > 0 && (
          <QuestionFooter>
            <TagList>
              {question.tags.map((tag) => (
                <Tag key={tag.id}>{tag.name}</Tag>
              ))}
            </TagList>
          </QuestionFooter>
        )}

        {/* 액션 바 */}
        <ActionBar>
          <VoteSection>
            <CommentToggleButton onClick={toggleQuestionComments}>
              <FaRegCommentDots />
              댓글 {question.comments?.length || 0}
            </CommentToggleButton>
            <VoteButton onClick={() => handleVote('up', 'question', question.id)}>
              👍
            </VoteButton>
          </VoteSection>

          {isAuthenticated && user?.id === question.author?.id && (
            <ActionButtons>
              <ActionButton onClick={handleEditQuestion}>수정</ActionButton>
              <ActionButton onClick={handleDeleteQuestion}>삭제</ActionButton>
            </ActionButtons>
          )}
        </ActionBar>

        {/* 질문 댓글 섹션 (토글) */}
        {showQuestionComments && (
          <CommentSection>
            {/* 댓글 작성 폼을 맨 위로 */}
            {isAuthenticated && (
              <CommentForm onSubmit={handleQuestionCommentSubmit}>
                <CommentInputArea>
                  <CommentInput
                    placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
                    value={questionComment}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                        setQuestionComment(e.target.value);
                      }
                    }}
                    maxLength={MAX_COMMENT_LENGTH}
                  />
                  <CommentInputFooter>
                    <CharacterCount $isOverLimit={questionComment.length > MAX_COMMENT_LENGTH}>
                      {questionComment.length}/{MAX_COMMENT_LENGTH}
                    </CharacterCount>
                    <SendIconButton
                      type="submit"
                      disabled={!questionComment.trim()}
                      title="댓글 작성"
                    >
                      <IoSend />
                    </SendIconButton>
                  </CommentInputFooter>
                </CommentInputArea>
              </CommentForm>
            )}

            {/* 댓글 목록 */}
            {question.comments && question.comments.length > 0 && (
              <CommentList>
                {question.comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <CommentAuthor>
                      <AuthorAvatar
                        src={comment.author?.profileImageUrl}
                        alt={comment.author?.nickname}
                      />
                      <AuthorName>{comment.author?.nickname || '익명'}</AuthorName>
                      <CommentTime>{formatTimeAgo(comment.createdAt)}</CommentTime>
                    </CommentAuthor>
                    <CommentContent>{comment.content}</CommentContent>
                  </CommentItem>
                ))}
              </CommentList>
            )}
          </CommentSection>
        )}
      </QuestionCard>

      {/* 답변 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitle>답변 {question.answerCount || 0}</SectionTitle>
        </SectionHeader>

        {question.answers && question.answers.length > 0 && (
          <AnswerList>
            {question.answers.map((answer) => (
              <AnswerItem key={answer.id} $isAccepted={answer.isAccepted}>
                {answer.isAccepted && <AcceptedBadge>✓ 채택된 답변</AcceptedBadge>}

                <AnswerHeader>
                  <AuthorInfo>
                    <AuthorAvatar
                      src={answer.author?.profileImageUrl}
                      alt={answer.author?.nickname}
                    />
                    <div>
                      <AnswerAuthor>{answer.author?.nickname || '익명'}</AnswerAuthor>
                      <TimeStamp style={{ display: 'block', marginTop: '4px' }}>
                        {formatTimeAgo(answer.createdAt)}
                      </TimeStamp>
                    </div>
                  </AuthorInfo>
                </AnswerHeader>

                <AnswerContent>{answer.content}</AnswerContent>

                <AnswerActions>
                  <VoteButton onClick={() => handleVote('up', 'answer', answer.id)}>
                    👍 추천
                  </VoteButton>
                  <VoteCount>{answer.voteCount || 0}</VoteCount>
                  <VoteButton onClick={() => handleVote('down', 'answer', answer.id)}>
                    👎 비추천
                  </VoteButton>
                  <CommentToggleButton onClick={() => toggleAnswerComments(answer.id)}>
                    <FaRegCommentDots />
                    댓글 {answer.comments?.length || 0}
                  </CommentToggleButton>
                </AnswerActions>

                {/* 답변 댓글 섹션 (토글) */}
                {showAnswerComments[answer.id] && (
                  <CommentSection>
                    {/* 댓글 작성 폼을 맨 위로 */}
                    {isAuthenticated && (
                      <CommentForm onSubmit={(e) => handleAnswerCommentSubmit(answer.id, e)}>
                        <CommentInputArea>
                          <CommentInput
                            placeholder="답변에 댓글을 입력하세요..."
                            value={answerComments[answer.id] || ''}
                            onChange={(e) => {
                              if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                                setAnswerComments({
                                  ...answerComments,
                                  [answer.id]: e.target.value,
                                });
                              }
                            }}
                            maxLength={MAX_COMMENT_LENGTH}
                          />
                          <CommentInputFooter>
                            <CharacterCount
                              $isOverLimit={(answerComments[answer.id] || '').length > MAX_COMMENT_LENGTH}
                            >
                              {(answerComments[answer.id] || '').length}/{MAX_COMMENT_LENGTH}
                            </CharacterCount>
                            <SendIconButton
                              type="submit"
                              disabled={!(answerComments[answer.id] || '').trim()}
                              title="댓글 작성"
                            >
                              <IoSend />
                            </SendIconButton>
                          </CommentInputFooter>
                        </CommentInputArea>
                      </CommentForm>
                    )}

                    {/* 댓글 목록 */}
                    {answer.comments && answer.comments.length > 0 && (
                      <CommentList>
                        {answer.comments.map((comment) => (
                          <CommentItem key={comment.id}>
                            <CommentAuthor>
                              <AuthorAvatar
                                src={comment.author?.profileImageUrl}
                                alt={comment.author?.nickname}
                              />
                              <AuthorName>{comment.author?.nickname || '익명'}</AuthorName>
                              <CommentTime>{formatTimeAgo(comment.createdAt)}</CommentTime>
                            </CommentAuthor>
                            <CommentContent>{comment.content}</CommentContent>
                          </CommentItem>
                        ))}
                      </CommentList>
                    )}
                  </CommentSection>
                )}
              </AnswerItem>
            ))}
          </AnswerList>
        )}
      </Section>

      {/* 하단 고정 답변하기 버튼 */}
      <FixedAnswerButton onClick={handleAnswerClick}>
        답변하기
      </FixedAnswerButton>
    </DetailContainer>
  );
};

export default QuestionDetailPage;
