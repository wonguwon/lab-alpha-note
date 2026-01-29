import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPatchCheckFill } from 'react-icons/bs';
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
  SortSelect,
  SearchInput,
  SearchButton,
  QuestionList,
  QuestionCard,
  AnswerBadge,
  AnswerBadgeLabel,
  AnswerBadgeCount,
  CheckIcon,
  SolvedBadge,
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
  CategoryBadge,
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
  const [sortOrder, setSortOrder] = useState('latest');
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState('all'); // 'my' or 'all'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('TITLE');
  const [loading, setLoading] = useState(false);

  // 질문 목록 조회
  useEffect(() => {
    loadQuestions();
  }, [currentPage, sortOrder, category, viewMode, isAuthenticated, user]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 20,
        sort: getSortParam(sortOrder),
      };

      // 카테고리 파라미터 추가 (전체가 아닐 경우)
      if (category !== 'all') {
        params.category = category;
      }

      let data;
      if (searchKeyword.trim()) {
        // 검색 모드 (카테고리 필터 포함 가능)
        params.keyword = searchKeyword;
        params.searchType = searchType;
        data = await qnaService.searchQuestions(params);
      } else if (isAuthenticated && viewMode === 'my' && user?.id) {
        // 내 질문 조회 (카테고리 필터 포함 가능)
        data = await qnaService.getQuestionsByUser(user.id, params);
      } else if (category !== 'all') {
        // 카테고리별 질문 조회 (전용 API 사용)
        data = await qnaService.getQuestionsByCategory(category, params);
      } else {
        // 전체 질문 조회
        data = await qnaService.getQuestions(params);
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

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(0);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(0);
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'TECH': '기술',
      'CAREER': '커리어',
      'ETC': '기타',
    };
    return categoryMap[category] || category;
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
            $active={category === 'all'}
            onClick={() => handleCategoryChange('all')}
          >
            전체
          </FilterTab>
          <FilterTab
            $active={category === 'TECH'}
            onClick={() => handleCategoryChange('TECH')}
          >
            기술
          </FilterTab>
          <FilterTab
            $active={category === 'CAREER'}
            onClick={() => handleCategoryChange('CAREER')}
          >
            커리어
          </FilterTab>
          <FilterTab
            $active={category === 'ETC'}
            onClick={() => handleCategoryChange('ETC')}
          >
            기타
          </FilterTab>
        </FilterTabs>
        <SearchBox>
          <SortSelect value={sortOrder} onChange={handleSortChange}>
            <option value="latest">최신순</option>
            <option value="answers">답변순</option>
            <option value="views">조회순</option>
          </SortSelect>
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
                {/* 답변 배지 */}
                <AnswerBadge
                  $hasAccepted={question.isAnswered}
                  $hasAnswers={question.answerCount > 0}
                >
                  <AnswerBadgeLabel>
                    {question.isAnswered ? '해결' : '답변'}
                  </AnswerBadgeLabel>
                  <AnswerBadgeCount>{question.answerCount || 0}</AnswerBadgeCount>
                  {question.isAnswered && (
                    <CheckIcon>
                      <BsPatchCheckFill />
                    </CheckIcon>
                  )}
                </AnswerBadge>

                <QuestionContent>
                  {/* 태그와 통계 */}
                  <QuestionFooter>
                    <TagList>
                      {/* 카테고리 배지 */}
                      {question.category && (
                        <CategoryBadge $category={question.category}>
                          {question.categoryDisplayName || getCategoryDisplayName(question.category)}
                        </CategoryBadge>
                      )}

                      {/* 태그 */}
                      {question.tags && question.tags.length > 0 && (
                        question.tags.map((tag) => (
                          <Tag key={tag.id}>{tag.name}</Tag>
                        ))
                      )}

                      {/* 작성 시간 */}
                      <TimeAgo>{formatTimeAgo(question.createdAt)}</TimeAgo>
                    </TagList>

                    {/* 통계 */}
                    <QuestionStats>
                      <StatItem>
                        <StatLabel>조회</StatLabel>
                        <StatValue>{question.viewCount || 0}</StatValue>
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
