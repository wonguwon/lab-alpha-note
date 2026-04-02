import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegCommentDots, FaCheckCircle } from 'react-icons/fa';
import { BsPatchQuestion } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { MdEdit, MdDelete } from 'react-icons/md';
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
  ActionButtons,
  ActionButton,
  CommentToggleButton,
  CommentSection,
  CommentList,
  CommentItem,
  CommentAuthor,
  CommentAuthorInfo,
  CommentActionButtons,
  CommentEditButton,
  CommentDeleteButton,
  CommentContentWrapper,
  CommentContent,
  CommentTime,
  CommentForm,
  CommentInputArea,
  CommentInput,
  CommentInputFooter,
  CharacterCount,
  SendIconButton,
  EditCommentInput,
  EditCommentActions,
  SaveButton,
  CancelButton,
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

  // 댓글 데이터 상태 (서버에서 로드된 실제 댓글 목록)
  const [questionComments, setQuestionComments] = useState([]);
  const [answerCommentsMap, setAnswerCommentsMap] = useState({}); // { answerId: Comment[] }

  // 댓글 로딩 상태
  const [loadingQuestionComments, setLoadingQuestionComments] = useState(false);
  const [loadingAnswerComments, setLoadingAnswerComments] = useState({});

  // 댓글 입력 상태
  const [questionComment, setQuestionComment] = useState('');
  const [answerComments, setAnswerComments] = useState({});

  // 댓글 편집 상태
  const [editingQuestionComment, setEditingQuestionComment] = useState(null);
  const [editingAnswerComment, setEditingAnswerComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  // 댓글 최대 글자수
  const MAX_COMMENT_LENGTH = 500;

  // 추천 중복 클릭 방지
  const [votingQuestion, setVotingQuestion] = useState(false);
  const [votingAnswers, setVotingAnswers] = useState({});

  // 답변하기 버튼 표시 상태 (스크롤 위치에 따라 제어)
  const [showAnswerButton, setShowAnswerButton] = useState(true);

  // 데이터 로드
  useEffect(() => {
    loadQuestionDetail();
  }, [id]);

  // 스크롤 이벤트 처리 - 하단 도달 시 답변하기 버튼 숨김
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // 하단에서 100px 이내에 도달하면 버튼 숨김
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      
      setShowAnswerButton(!isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    
    // 초기 상태 확인
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // 질문 추천 핸들러
  const handleQuestionVote = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (votingQuestion) return; // 중복 클릭 방지

    const isVoted = question.isVotedByCurrentUser;
    const previousVoteCount = question.voteCount;

    // Optimistic update
    setQuestion({
      ...question,
      isVotedByCurrentUser: !isVoted,
      voteCount: isVoted ? previousVoteCount - 1 : previousVoteCount + 1,
    });

    setVotingQuestion(true);

    try {
      if (isVoted) {
        await qnaService.unvoteQuestion(question.id);
      } else {
        await qnaService.voteQuestion(question.id);
      }
    } catch (err) {
      console.error('질문 추천 실패:', err);
      // Rollback on error
      setQuestion({
        ...question,
        isVotedByCurrentUser: isVoted,
        voteCount: previousVoteCount,
      });
      alert(err.response?.data?.message || '추천에 실패했습니다.');
    } finally {
      setVotingQuestion(false);
    }
  };

  // 답변 추천 핸들러
  const handleAnswerVote = async (answerId) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (votingAnswers[answerId]) return; // 중복 클릭 방지

    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) return;

    const isVoted = answer.isVotedByCurrentUser;
    const previousVoteCount = answer.voteCount;

    // Optimistic update
    setQuestion({
      ...question,
      answers: question.answers.map(a =>
        a.id === answerId
          ? {
              ...a,
              isVotedByCurrentUser: !isVoted,
              voteCount: isVoted ? previousVoteCount - 1 : previousVoteCount + 1,
            }
          : a
      ),
    });

    setVotingAnswers({ ...votingAnswers, [answerId]: true });

    try {
      if (isVoted) {
        await qnaService.unvoteAnswer(answerId);
      } else {
        await qnaService.voteAnswer(answerId);
      }
    } catch (err) {
      console.error('답변 추천 실패:', err);
      // Rollback on error
      setQuestion({
        ...question,
        answers: question.answers.map(a =>
          a.id === answerId
            ? {
                ...a,
                isVotedByCurrentUser: isVoted,
                voteCount: previousVoteCount,
              }
            : a
        ),
      });
      alert(err.response?.data?.message || '추천에 실패했습니다.');
    } finally {
      setVotingAnswers({ ...votingAnswers, [answerId]: false });
    }
  };

  // 질문 댓글 로드
  const loadQuestionComments = async () => {
    if (questionComments.length > 0) return; // 이미 로드됨

    setLoadingQuestionComments(true);
    try {
      const comments = await qnaService.getQuestionComments(id);
      setQuestionComments(comments);
    } catch (err) {
      console.error('질문 댓글 조회 실패:', err);
      alert(err.response?.data?.message || '댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoadingQuestionComments(false);
    }
  };

  // 답변 댓글 로드
  const loadAnswerComments = async (answerId) => {
    if (answerCommentsMap[answerId]) return; // 이미 로드됨

    setLoadingAnswerComments({ ...loadingAnswerComments, [answerId]: true });
    try {
      const comments = await qnaService.getAnswerComments(answerId);
      setAnswerCommentsMap({ ...answerCommentsMap, [answerId]: comments });
    } catch (err) {
      console.error('답변 댓글 조회 실패:', err);
      alert(err.response?.data?.message || '댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoadingAnswerComments({ ...loadingAnswerComments, [answerId]: false });
    }
  };

  // 질문 댓글 토글
  const toggleQuestionComments = () => {
    const newState = !showQuestionComments;
    setShowQuestionComments(newState);

    // 처음 열 때만 로드
    if (newState && questionComments.length === 0) {
      loadQuestionComments();
    }
  };

  // 답변 댓글 토글
  const toggleAnswerComments = (answerId) => {
    const newState = !showAnswerComments[answerId];
    setShowAnswerComments({
      ...showAnswerComments,
      [answerId]: newState
    });

    // 처음 열 때만 로드
    if (newState && !answerCommentsMap[answerId]) {
      loadAnswerComments(answerId);
    }
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

    if (questionComment.length > MAX_COMMENT_LENGTH) {
      alert(`댓글은 최대 ${MAX_COMMENT_LENGTH}자까지 입력 가능합니다.`);
      return;
    }

    try {
      const newComment = await qnaService.createQuestionComment(id, { content: questionComment });
      // 최신순 정렬을 위해 맨 앞에 추가
      setQuestionComments([newComment, ...questionComments]);
      setQuestionComment('');
      // 댓글 개수 증가
      setQuestion({ ...question, commentCount: question.commentCount + 1 });
    } catch (err) {
      console.error('질문 댓글 작성 실패:', err);
      alert(err.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
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

    if (comment.length > MAX_COMMENT_LENGTH) {
      alert(`댓글은 최대 ${MAX_COMMENT_LENGTH}자까지 입력 가능합니다.`);
      return;
    }

    try {
      const newComment = await qnaService.createAnswerComment(answerId, { content: comment });
      const currentComments = answerCommentsMap[answerId] || [];
      // 최신순 정렬을 위해 맨 앞에 추가
      setAnswerCommentsMap({ ...answerCommentsMap, [answerId]: [newComment, ...currentComments] });
      setAnswerComments({ ...answerComments, [answerId]: '' });

      // 답변의 댓글 개수 증가
      setQuestion({
        ...question,
        answers: question.answers.map(a =>
          a.id === answerId ? { ...a, commentCount: a.commentCount + 1 } : a
        )
      });
    } catch (err) {
      console.error('답변 댓글 작성 실패:', err);
      alert(err.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  };

  // 질문 댓글 수정 시작
  const handleEditQuestionComment = (comment) => {
    setEditingQuestionComment(comment.id);
    setEditCommentContent(comment.content);
  };

  // 질문 댓글 수정 취소
  const handleCancelEditQuestionComment = () => {
    setEditingQuestionComment(null);
    setEditCommentContent('');
  };

  // 질문 댓글 수정 저장
  const handleSaveQuestionComment = async (commentId) => {
    if (!editCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (editCommentContent.length > MAX_COMMENT_LENGTH) {
      alert(`댓글은 최대 ${MAX_COMMENT_LENGTH}자까지 입력 가능합니다.`);
      return;
    }

    try {
      const updatedComment = await qnaService.updateQuestionComment(commentId, { content: editCommentContent });
      setQuestionComments(questionComments.map(c =>
        c.id === commentId ? updatedComment : c
      ));
      setEditingQuestionComment(null);
      setEditCommentContent('');
    } catch (err) {
      console.error('질문 댓글 수정 실패:', err);
      alert(err.response?.data?.message || '댓글 수정에 실패했습니다.');
    }
  };

  // 질문 댓글 삭제
  const handleDeleteQuestionComment = async (commentId) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await qnaService.deleteQuestionComment(commentId);
      setQuestionComments(questionComments.filter(c => c.id !== commentId));
      // 댓글 개수 감소
      setQuestion({ ...question, commentCount: question.commentCount - 1 });
    } catch (err) {
      console.error('질문 댓글 삭제 실패:', err);
      alert(err.response?.data?.message || '댓글 삭제에 실패했습니다.');
    }
  };

  // 답변 댓글 수정 시작
  const handleEditAnswerComment = (comment) => {
    setEditingAnswerComment(comment.id);
    setEditCommentContent(comment.content);
  };

  // 답변 댓글 수정 취소
  const handleCancelEditAnswerComment = () => {
    setEditingAnswerComment(null);
    setEditCommentContent('');
  };

  // 답변 댓글 수정 저장
  const handleSaveAnswerComment = async (commentId, answerId) => {
    if (!editCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (editCommentContent.length > MAX_COMMENT_LENGTH) {
      alert(`댓글은 최대 ${MAX_COMMENT_LENGTH}자까지 입력 가능합니다.`);
      return;
    }

    try {
      const updatedComment = await qnaService.updateAnswerComment(commentId, { content: editCommentContent });
      const currentComments = answerCommentsMap[answerId] || [];
      setAnswerCommentsMap({
        ...answerCommentsMap,
        [answerId]: currentComments.map(c => c.id === commentId ? updatedComment : c)
      });
      setEditingAnswerComment(null);
      setEditCommentContent('');
    } catch (err) {
      console.error('답변 댓글 수정 실패:', err);
      alert(err.response?.data?.message || '댓글 수정에 실패했습니다.');
    }
  };

  // 답변 댓글 삭제
  const handleDeleteAnswerComment = async (commentId, answerId) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await qnaService.deleteAnswerComment(commentId);
      const currentComments = answerCommentsMap[answerId] || [];
      setAnswerCommentsMap({
        ...answerCommentsMap,
        [answerId]: currentComments.filter(c => c.id !== commentId)
      });

      // 답변의 댓글 개수 감소
      setQuestion({
        ...question,
        answers: question.answers.map(a =>
          a.id === answerId ? { ...a, commentCount: a.commentCount - 1 } : a
        )
      });
    } catch (err) {
      console.error('답변 댓글 삭제 실패:', err);
      alert(err.response?.data?.message || '댓글 삭제에 실패했습니다.');
    }
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

  // 답변 수정
  const handleEditAnswer = (answerId) => {
    navigate(`/qna/${id}/answer/${answerId}/edit`);
  };

  // 답변 삭제
  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('정말로 이 답변을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await qnaService.deleteAnswer(answerId);
      alert('답변이 삭제되었습니다.');
      // 답변 목록 새로고침
      loadQuestionDetail();
    } catch (err) {
      console.error('답변 삭제 실패:', err);
      alert(err.response?.data?.message || '답변 삭제에 실패했습니다.');
    }
  };

  // 답변 채택
  const handleAcceptAnswer = async (answerId) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!window.confirm('이 답변을 채택하시겠습니까?')) {
      return;
    }

    try {
      await qnaService.acceptAnswer(question.id, answerId);
      // 질문 상세 새로고침
      loadQuestionDetail();
      alert('답변이 채택되었습니다.');
    } catch (err) {
      console.error('답변 채택 실패:', err);
      alert(err.response?.data?.message || '답변 채택에 실패했습니다.');
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
                추천 <strong>{question.voteCount || 0}</strong>
              </StatItem>
            </Stats>
          </QuestionMeta>
        </QuestionHeader>

        {/* 질문 본문 */}
        <QuestionBody>
          <QuestionContent dangerouslySetInnerHTML={{ __html: question.content }} />
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
              댓글 {question.commentCount || 0}
            </CommentToggleButton>
            <VoteButton
              onClick={handleQuestionVote}
              $voted={question.isVotedByCurrentUser}
              disabled={votingQuestion}
            >
              👍 {question.voteCount || 0}
            </VoteButton>
          </VoteSection>
          {isAuthenticated && user?.id === question.userId && (
            <ActionButtons>
              <ActionButton onClick={handleEditQuestion}>
                <MdEdit size={16} />
                수정
              </ActionButton>
              <ActionButton onClick={handleDeleteQuestion} $danger>
                <MdDelete size={16} />
                삭제
              </ActionButton>
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
            {loadingQuestionComments ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                댓글을 불러오는 중...
              </div>
            ) : questionComments.length > 0 && (
              <CommentList>
                {questionComments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <CommentAuthor>
                      <CommentAuthorInfo>
                        <AuthorAvatar
                          src={comment?.profileImageUrl}
                          alt={comment?.userNickname}
                        />
                        <AuthorName>{comment?.userNickname || '익명'}</AuthorName>
                        <CommentTime>{formatTimeAgo(comment.createdAt)}</CommentTime>
                      </CommentAuthorInfo>
                      {!editingQuestionComment && isAuthenticated && user?.id === comment?.userId && (
                        <CommentActionButtons>
                          <CommentEditButton onClick={() => handleEditQuestionComment(comment)}>
                            <MdEdit size={16} />
                          </CommentEditButton>
                          <CommentDeleteButton onClick={() => handleDeleteQuestionComment(comment.id)}>
                            <MdDelete size={16} />
                          </CommentDeleteButton>
                        </CommentActionButtons>
                      )}
                    </CommentAuthor>
                    {editingQuestionComment === comment.id ? (
                      <>
                        <EditCommentInput
                          value={editCommentContent}
                          onChange={(e) => {
                            if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                              setEditCommentContent(e.target.value);
                            }
                          }}
                          maxLength={MAX_COMMENT_LENGTH}
                        />
                        <EditCommentActions>
                          <CharacterCount $isOverLimit={editCommentContent.length > MAX_COMMENT_LENGTH}>
                            {editCommentContent.length}/{MAX_COMMENT_LENGTH}
                          </CharacterCount>
                          <CancelButton onClick={handleCancelEditQuestionComment}>
                            취소
                          </CancelButton>
                          <SaveButton onClick={() => handleSaveQuestionComment(comment.id)}>
                            저장
                          </SaveButton>
                        </EditCommentActions>
                      </>
                    ) : (
                      <CommentContentWrapper>
                        <CommentContent>{comment.content}</CommentContent>
                      </CommentContentWrapper>
                    )}
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
              <AnswerItem key={answer.id}>
                {answer.isAccepted && (
                  <AcceptedBadge>
                    <FaCheckCircle />
                    <span>채택된 답변입니다</span>
                  </AcceptedBadge>
                )}

                <AnswerHeader>
                  <AuthorInfo>
                    <AuthorAvatar
                      src={answer?.profileImageUrl}
                      alt={answer?.userNickname}
                    />
                    <div>
                      <AnswerAuthor>{answer?.userNickname || '익명'}</AnswerAuthor>
                      <TimeStamp style={{ display: 'block', marginTop: '4px' }}>
                        {formatTimeAgo(answer.createdAt)}
                      </TimeStamp>
                    </div>
                  </AuthorInfo>
                </AnswerHeader>

                <AnswerContent dangerouslySetInnerHTML={{ __html: answer.content }} />

                <AnswerActions>
                  <VoteSection>
                    <CommentToggleButton onClick={() => toggleAnswerComments(answer.id)}>
                      <FaRegCommentDots />
                      댓글 {answer.commentCount || 0}
                    </CommentToggleButton>
                    <VoteButton
                      onClick={() => handleAnswerVote(answer.id)}
                      $voted={answer.isVotedByCurrentUser}
                      disabled={votingAnswers[answer.id]}
                    >
                      👍 {answer.voteCount || 0}
                    </VoteButton>
                  </VoteSection>

                  <ActionButtons>
                    {/* 질문 작성자만 채택 버튼 표시 (현재 답변이 채택되지 않은 경우) */}
                    {isAuthenticated && user?.id === question.userId && !answer.isAccepted && (
                      <ActionButton onClick={() => handleAcceptAnswer(answer.id)} $primary>
                        <FaCheckCircle size={16} />
                        채택
                      </ActionButton>
                    )}

                    {/* 답변 작성자만 수정/삭제 버튼 표시 */}
                    {isAuthenticated && user?.id === answer.userId && (
                      <>
                        <ActionButton onClick={() => handleEditAnswer(answer.id)}>
                          <MdEdit size={16} />
                          수정
                        </ActionButton>
                        <ActionButton onClick={() => handleDeleteAnswer(answer.id)} $danger>
                          <MdDelete size={16} />
                          삭제
                        </ActionButton>
                      </>
                    )}
                  </ActionButtons>
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
                    {loadingAnswerComments[answer.id] ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                        댓글을 불러오는 중...
                      </div>
                    ) : (answerCommentsMap[answer.id] && answerCommentsMap[answer.id].length > 0) && (
                      <CommentList>
                        {answerCommentsMap[answer.id].map((comment) => (
                          <CommentItem key={comment.id}>
                            <CommentAuthor>
                              <CommentAuthorInfo>
                                <AuthorAvatar
                                  src={comment?.profileImageUrl}
                                  alt={comment?.userNickname}
                                />
                                <AuthorName>{comment?.userNickname || '익명'}</AuthorName>
                                <CommentTime>{formatTimeAgo(comment.createdAt)}</CommentTime>
                              </CommentAuthorInfo>
                              {!editingAnswerComment && isAuthenticated && user?.id === comment?.userId && (
                                <CommentActionButtons>
                                  <CommentEditButton onClick={() => handleEditAnswerComment(comment)}>
                                    <MdEdit size={16} />
                                  </CommentEditButton>
                                  <CommentDeleteButton onClick={() => handleDeleteAnswerComment(comment.id, answer.id)}>
                                    <MdDelete size={16} />
                                  </CommentDeleteButton>
                                </CommentActionButtons>
                              )}
                            </CommentAuthor>
                            {editingAnswerComment === comment.id ? (
                              <>
                                <EditCommentInput
                                  value={editCommentContent}
                                  onChange={(e) => {
                                    if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                                      setEditCommentContent(e.target.value);
                                    }
                                  }}
                                  maxLength={MAX_COMMENT_LENGTH}
                                />
                                <EditCommentActions>
                                  <CharacterCount $isOverLimit={editCommentContent.length > MAX_COMMENT_LENGTH}>
                                    {editCommentContent.length}/{MAX_COMMENT_LENGTH}
                                  </CharacterCount>
                                  <CancelButton onClick={handleCancelEditAnswerComment}>
                                    취소
                                  </CancelButton>
                                  <SaveButton onClick={() => handleSaveAnswerComment(comment.id, answer.id)}>
                                    저장
                                  </SaveButton>
                                </EditCommentActions>
                              </>
                            ) : (
                              <CommentContentWrapper>
                                <CommentContent>{comment.content}</CommentContent>
                              </CommentContentWrapper>
                            )}
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
      <FixedAnswerButton onClick={handleAnswerClick} $show={showAnswerButton}>
        답변하기
      </FixedAnswerButton>
    </DetailContainer>
  );
};

export default QuestionDetailPage;
