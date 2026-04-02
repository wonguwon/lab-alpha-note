import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdArrowBack } from 'react-icons/md';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoPersonCircle, IoSend } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { growthLogService } from '../../api/services';
import useAuthStore from '../../store/authStore';
import {
  DetailContainer,
  BackButton,
  GrowthLogCard,
  GrowthLogHeader,
  GrowthLogTitle,
  GrowthLogMeta,
  AuthorInfo,
  AuthorAvatar,
  AuthorName,
  MetaDivider,
  TimeStamp,
  GrowthLogImage,
  GrowthLogBody,
  TagList,
  Tag,
  ActionBar,
  ActionButtons,
  ActionButton,
  EmptyState,
  LoadingState,
  VoteSection,
  CommentToggleButton,
  VoteButton,
  CommentSection,
  CommentForm,
  CommentInputArea,
  CommentInput,
  CommentInputFooter,
  CharacterCount,
  SendIconButton,
  CommentList,
  CommentItem,
  CommentAuthor,
  CommentAuthorInfo,
  CommentTime,
  CommentContentWrapper,
  CommentContent,
  EmptyState as CommentEmptyState
} from './GrowthLogDetailPage.styled';

const GrowthLogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [growthLog, setGrowthLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [voting, setVoting] = useState(false);
  const MAX_COMMENT_LENGTH = 500;

  useEffect(() => {
    loadGrowthLogDetail();
  }, [id]);

  const loadGrowthLogDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await growthLogService.getGrowthLog(id);
      setGrowthLog(data);
    } catch (err) {
      console.error('성장기록 상세 조회 실패:', err);
      setError(err.response?.data?.message || '성장기록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/growth-logs/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await growthLogService.deleteGrowthLog(id);
      alert('글이 삭제되었습니다.');
      navigate('/growth-logs');
    } catch (err) {
      console.error('성장기록 삭제 실패:', err);
      alert(err.response?.data?.message || '글 삭제에 실패했습니다.');
    }
  };

  const toggleComments = () => {
    const nextShowComments = !showComments;
    setShowComments(nextShowComments);
    if (nextShowComments && comments.length === 0) {
      loadComments();
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await growthLogService.getComments(id);
      setComments(data);
    } catch (err) {
      console.error('댓글 조회 실패:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleVote = async () => {
    if (!isAuthenticated) {
      alert('좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }

    if (voting) return;

    const isVoted = growthLog.isVotedByCurrentUser;
    const previousVoteCount = growthLog.voteCount || 0;

    // Optimistic update
    setGrowthLog({
      ...growthLog,
      isVotedByCurrentUser: !isVoted,
      voteCount: isVoted ? previousVoteCount - 1 : previousVoteCount + 1,
    });

    setVoting(true);

    try {
      if (isVoted) {
        await growthLogService.unvoteGrowthLog(id);
      } else {
        await growthLogService.voteGrowthLog(id);
      }
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      // Rollback on error
      setGrowthLog({
        ...growthLog,
        isVotedByCurrentUser: isVoted,
        voteCount: previousVoteCount,
      });
      alert(err.response?.data?.message || '좋아요 처리에 실패했습니다.');
    } finally {
      setVoting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await growthLogService.createComment(id, { content: newComment });
      setNewComment('');
      loadComments(); // Refresh comments list
      // Update growth comment count locally
      setGrowthLog(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert(err.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  };

  const formatTimeAgo = (dateString, updatedDateString) => {
    const date = new Date(updatedDateString || dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Markdown 여부 체크 (기존 HTML과 호환)
  const isMarkdown = (content) => {
    if (!content) return false;
    // HTML 태그가 있으면 HTML로 판단
    if (content.includes('<p>') || content.includes('<h1>') || content.includes('<div>')) {
      return false;
    }
    // Markdown 특징이 있으면 Markdown으로 판단
    return content.includes('#') ||
      content.includes('```') ||
      content.includes('**') ||
      content.includes('![') ||  // 이미지
      content.includes('[](') || // 링크
      content.includes('- ') ||  // 리스트
      content.includes('|') ||   // 테이블
      content.includes('* ');    // 리스트
  };

  // 헬퍼 함수: 텍스트에서 slug 생성
  const createSlug = (children) => {
    const text = React.Children.toArray(children)
      .map((child) => (typeof child === 'string' ? child : (child.props?.children ? createSlug(child.props.children) : '')))
      .join('');
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s가-힣-]/g, '')
      .replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <DetailContainer>
        <LoadingState>로딩 중...</LoadingState>
      </DetailContainer>
    );
  }

  if (error) {
    return (
      <DetailContainer>
        <EmptyState>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
          <BackButton onClick={() => navigate('/growth-logs')}>목록으로 돌아가기</BackButton>
        </EmptyState>
      </DetailContainer>
    );
  }

  if (!growthLog) {
    return (
      <DetailContainer>
        <EmptyState>
          <h3>글을 찾을 수 없습니다</h3>
          <BackButton onClick={() => navigate('/growth-logs')}>목록으로 돌아가기</BackButton>
        </EmptyState>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/growth-logs')}>
        <MdArrowBack /> 목록으로
      </BackButton>

      <GrowthLogCard>
        {growthLog.thumbnailUrl && <GrowthLogImage src={growthLog.thumbnailUrl} alt={growthLog.title} />}

        <GrowthLogHeader>
          <GrowthLogTitle>{growthLog.title}</GrowthLogTitle>
          <GrowthLogMeta>
            <AuthorInfo>
              {growthLog.profileImageUrl ? (
                <AuthorAvatar
                  src={growthLog.profileImageUrl}
                  alt={growthLog.userNickname}
                />
              ) : (
                <IoPersonCircle size={36} color="#9ca3af" />
              )}
              <AuthorName>{growthLog.userNickname || 'Unknown'}</AuthorName>
            </AuthorInfo>
            <MetaDivider>|</MetaDivider>
            <TimeStamp>{formatTimeAgo(growthLog.createdAt, growthLog.updatedAt)}</TimeStamp>
          </GrowthLogMeta>

          {growthLog.tags && growthLog.tags.length > 0 && (
            <TagList>
              {growthLog.tags.map((tag, index) => (
                <Tag key={index}>{typeof tag === 'string' ? tag : tag.name}</Tag>
              ))}
            </TagList>
          )}
        </GrowthLogHeader>

        <GrowthLogBody>
          {isMarkdown(growthLog.content) ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({ children }) => <h1 id={createSlug(children)}>{children}</h1>,
                h2: ({ children }) => <h2 id={createSlug(children)}>{children}</h2>,
                h3: ({ children }) => <h3 id={createSlug(children)}>{children}</h3>,
                h4: ({ children }) => <h4 id={createSlug(children)}>{children}</h4>,
                h5: ({ children }) => <h5 id={createSlug(children)}>{children}</h5>,
                h6: ({ children }) => <h6 id={createSlug(children)}>{children}</h6>,
                a: ({ href, children, ...props }) => {
                  if (href?.startsWith('#')) {
                    const handleClick = (e) => {
                      e.preventDefault();
                      const element = document.getElementById(decodeURIComponent(href.slice(1)));
                      if (element) {
                        const offset = 80; // 헤더 높이(60px) + 여백
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    };
                    return <a href={href} onClick={handleClick} {...props}>{children}</a>;
                  }
                  return <a href={href} {...props}>{children}</a>;
                },
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {growthLog.content}
            </ReactMarkdown>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: growthLog.content }} />
          )}
        </GrowthLogBody>

        <ActionBar>
          <VoteSection>
            <CommentToggleButton onClick={toggleComments}>
              <FaRegCommentDots />
              댓글 {growthLog.commentCount || 0}
            </CommentToggleButton>
            <VoteButton
              onClick={handleVote}
              $voted={growthLog.isVotedByCurrentUser}
              disabled={voting}
            >
              👍 {growthLog.voteCount || 0}
            </VoteButton>
          </VoteSection>
          {isAuthenticated && user?.id === growthLog.userId && (
            <ActionButtons>
              <ActionButton onClick={handleEdit}>
                <MdEdit size={16} />
                수정
              </ActionButton>
              <ActionButton onClick={handleDelete} $danger>
                <MdDelete size={16} />
                삭제
              </ActionButton>
            </ActionButtons>
          )}
        </ActionBar>

        {showComments && (
          <CommentSection>
            {isAuthenticated && (
              <CommentForm onSubmit={handleCommentSubmit}>
                <CommentInputArea>
                  <CommentInput
                    placeholder="칭찬과 격려의 댓글은 작성자에게 큰 힘이 됩니다 :)"
                    value={newComment}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                        setNewComment(e.target.value);
                      }
                    }}
                    maxLength={MAX_COMMENT_LENGTH}
                  />
                  <CommentInputFooter>
                    <CharacterCount $isOverLimit={newComment.length > MAX_COMMENT_LENGTH}>
                      {newComment.length}/{MAX_COMMENT_LENGTH}
                    </CharacterCount>
                    <SendIconButton
                      type="submit"
                      disabled={!newComment.trim()}
                      title="댓글 작성"
                    >
                      <IoSend />
                    </SendIconButton>
                  </CommentInputFooter>
                </CommentInputArea>
              </CommentForm>
            )}

            {loadingComments ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                댓글을 불러오는 중...
              </div>
            ) : comments.length > 0 ? (
              <CommentList>
                {comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <CommentAuthor>
                      <CommentAuthorInfo>
                        {comment.profileImageUrl ? (
                          <AuthorAvatar
                            src={comment.profileImageUrl}
                            alt={comment.userNickname}
                          />
                        ) : (
                          <IoPersonCircle size={36} color="#9ca3af" />
                        )}
                        <AuthorName>{comment.userNickname || 'Unknown'}</AuthorName>
                        <CommentTime>{formatTimeAgo(comment.createdAt, comment.updatedAt)}</CommentTime>
                      </CommentAuthorInfo>
                    </CommentAuthor>
                    <CommentContentWrapper>
                      <CommentContent>{comment.content}</CommentContent>
                    </CommentContentWrapper>
                  </CommentItem>
                ))}
              </CommentList>
            ) : (
              <CommentEmptyState>
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  아직 댓글이 없습니다.
                </div>
              </CommentEmptyState>
            )}
          </CommentSection>
        )}
      </GrowthLogCard>
    </DetailContainer>
  );
};

export default GrowthLogDetailPage;
