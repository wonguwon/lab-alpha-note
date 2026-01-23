import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { qnaService } from '../../api/services';
import useAuthStore from '../../store/authStore';
import {
  QnAContainer,
  QnAHeader,
  PageTitle,
  HeaderActions,
  ToggleGroup,
  ToggleButton,
  AskButton,
  FilterSection,
  FilterTabs,
  FilterTab,
  SearchBox,
  SearchTypeSelect,
  SearchInput,
  SearchButton,
  QuestionList,
  QuestionCard,
  QuestionStats,
  StatItem,
  StatValue,
  StatLabel,
  QuestionContent,
  QuestionTitle,
  QuestionExcerpt,
  QuestionFooter,
  TagList,
  Tag,
  QuestionMeta,
  AuthorInfo,
  AuthorAvatar,
  AuthorName,
  TimeAgo,
  Pagination,
  PageButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription
} from './QnAPage.styled';

const QnAPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [questions, setQuestions] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('latest');
  const [viewMode, setViewMode] = useState('all'); // 'my' or 'all'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('TITLE');
  const [loading, setLoading] = useState(false);

  // 질문 목록 조회
  useEffect(() => {
    loadQuestions();
  }, [currentPage, filter, viewMode, isAuthenticated, user]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 20,
      };

      let data;
      if (searchKeyword.trim()) {
        // 검색 API 사용 (필터에 따른 정렬 적용)
        params.keyword = searchKeyword;
        params.searchType = searchType;
        params.sort = getSortParam(filter);
        data = await qnaService.searchQuestions(params);
      } else {
        // viewMode에 따라 다른 API 사용
        params.sort = getSortParam(filter);
        if (isAuthenticated && viewMode === 'my' && user?.id) {
          // 내 질문 조회
          data = await qnaService.getQuestionsByUser(user.id, params);
        } else {
          // 모든 질문 조회
          data = await qnaService.getQuestions(params);
        }
      }

      setQuestions(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('질문 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSortParam = (filter) => {
    switch (filter) {
      case 'latest':
        return 'createdAt,desc';
      case 'answers':
        return 'answerCount,desc';
      case 'views':
        return 'viewCount,desc';
      default:
        return 'createdAt,desc';
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(0);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    loadQuestions();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/qna/${questionId}`);
  };

  const handleAskQuestion = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/qna/ask');
  };

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

  const renderPagination = () => {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          $active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </PageButton>
      );
    }

    return (
      <Pagination>
        <PageButton
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          이전
        </PageButton>
        {pages}
        <PageButton
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          다음
        </PageButton>
      </Pagination>
    );
  };

  return (
    <QnAContainer>
      {/* 헤더 */}
      <QnAHeader>
        <PageTitle>Q&A</PageTitle>
        <HeaderActions>
          {isAuthenticated && (
            <ToggleGroup>
              <ToggleButton
                $active={viewMode === 'all'}
                onClick={() => {
                  setViewMode('all');
                  setCurrentPage(0);
                }}
              >
                모든 질문
              </ToggleButton>
              <ToggleButton
                $active={viewMode === 'my'}
                onClick={() => {
                  setViewMode('my');
                  setCurrentPage(0);
                }}
              >
                내 질문
              </ToggleButton>
            </ToggleGroup>
          )}
          {isAuthenticated && (
            <AskButton onClick={handleAskQuestion}>질문하기</AskButton>
          )}
        </HeaderActions>
      </QnAHeader>

      {/* 필터 및 검색 */}
      <FilterSection>
        <FilterTabs>
          <FilterTab
            $active={filter === 'latest'}
            onClick={() => handleFilterChange('latest')}
          >
            최신순
          </FilterTab>
          <FilterTab
            $active={filter === 'answers'}
            onClick={() => handleFilterChange('answers')}
          >
            답변순
          </FilterTab>
          <FilterTab
            $active={filter === 'views'}
            onClick={() => handleFilterChange('views')}
          >
            조회순
          </FilterTab>
        </FilterTabs>
        <SearchBox>
          <SearchTypeSelect
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="TITLE">제목</option>
            <option value="CONTENT">내용</option>
            <option value="AUTHOR">작성자</option>
          </SearchTypeSelect>
          <SearchInput
            type="text"
            placeholder="질문 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchBox>
      </FilterSection>

      {/* 질문 목록 */}
      {loading ? (
        <EmptyState>
          <EmptyDescription>질문 목록을 불러오는 중...</EmptyDescription>
        </EmptyState>
      ) : questions.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <EmptyTitle>아직 질문이 없습니다</EmptyTitle>
          <EmptyDescription>
            {isAuthenticated
              ? '첫 번째 질문을 올려보세요!'
              : '로그인하고 질문을 올려보세요!'}
          </EmptyDescription>
          {isAuthenticated && (
            <AskButton onClick={handleAskQuestion}>질문하기</AskButton>
          )}
        </EmptyState>
      ) : (
        <>
          <QuestionList>
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                onClick={() => handleQuestionClick(question.id)}
              >
                <QuestionContent>
                  {/* 태그와 통계 */}
                  <QuestionFooter>
                    {/* 태그 */}
                    {question.tags && question.tags.length > 0 && (
                      <TagList>
                        {question.tags.map((tag) => (
                          <Tag key={tag.id}>{tag.name}</Tag>
                        ))}
                      </TagList>
                    )}

                    {/* 통계 */}
                    <QuestionStats>
                      <StatItem>
                        <StatLabel>조회</StatLabel>
                        <StatValue>{question.viewCount || 0}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>답변</StatLabel>
                        <StatValue $answered={question.answerCount > 0}>
                          {question.answerCount || 0}
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>추천</StatLabel>
                        <StatValue>{question.likeCount || 0}</StatValue>
                      </StatItem>
                    </QuestionStats>
                  </QuestionFooter>

                  {/* 제목 */}
                  <QuestionTitle>{question.title}</QuestionTitle>

                  {/* 내용 */}
                  <QuestionExcerpt dangerouslySetInnerHTML={{ __html: question.contentPreview }} />

                  {/* 메타 정보 */}
                  <QuestionMeta>
                    <AuthorInfo>
                      <AuthorAvatar
                          src={question.profileImageUrl}
                          alt={question.userNickname}
                      />
                      <AuthorName>{question.userNickname || '익명'}</AuthorName>
                    </AuthorInfo>
                    <TimeAgo>{formatTimeAgo(question.createdAt)}</TimeAgo>
                  </QuestionMeta>
                </QuestionContent>
              </QuestionCard>
            ))}
          </QuestionList>

          {/* 페이지네이션 */}
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </QnAContainer>
  );
};

export default QnAPage;
