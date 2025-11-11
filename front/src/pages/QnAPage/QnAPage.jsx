import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircle } from 'react-icons/io5';
import { qnaService } from '../../api/services';
import useAuthStore from '../../store/authStore';
import {
  QnAContainer,
  QnAHeader,
  TitleSection,
  PageTitle,
  QnAStats,
  AskButton,
  FilterSection,
  FilterTabs,
  FilterTab,
  SearchBox,
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
  const { isAuthenticated } = useAuthStore();
  const [questions, setQuestions] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // 질문 목록 조회
  useEffect(() => {
    loadQuestions();
  }, [currentPage, filter]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 20,
        sort: getSortParam(filter),
      };

      if (searchKeyword) {
        params.keyword = searchKeyword;
      }

      const data = await qnaService.getQuestions(params);
      setQuestions(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('질문 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSortParam = (filter) => {
    switch (filter) {
      case 'latest':
        return 'lastActivityAt,desc';
      case 'unanswered':
        return 'answerCount,asc';
      case 'popular':
        return 'viewCount,desc';
      default:
        return 'lastActivityAt,desc';
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
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
        >
          처음
        </PageButton>
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
        <PageButton
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
        >
          마지막
        </PageButton>
      </Pagination>
    );
  };

  return (
    <QnAContainer>
      {/* 헤더 */}
      <QnAHeader>
        <TitleSection>
          <PageTitle>Q&A</PageTitle>
          <QnAStats>
            <span>{totalElements.toLocaleString()}개의 질문</span>
          </QnAStats>
        </TitleSection>
        <AskButton onClick={handleAskQuestion}>질문하기</AskButton>
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
            $active={filter === 'unanswered'}
            onClick={() => handleFilterChange('unanswered')}
          >
            미해결
          </FilterTab>
          <FilterTab
            $active={filter === 'popular'}
            onClick={() => handleFilterChange('popular')}
          >
            인기순
          </FilterTab>
        </FilterTabs>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="질문 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchBox>
      </FilterSection>

      {/* 질문 목록 */}
      {loading ? (
        <EmptyState>
          <EmptyDescription>로딩 중...</EmptyDescription>
        </EmptyState>
      ) : questions.length === 0 ? (
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <EmptyTitle>아직 질문이 없습니다</EmptyTitle>
          <EmptyDescription>
            첫 번째 질문을 올려보세요!
          </EmptyDescription>
          <AskButton onClick={handleAskQuestion}>질문하기</AskButton>
        </EmptyState>
      ) : (
        <>
          <QuestionList>
            {console.log(questions)}
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                onClick={() => handleQuestionClick(question.id)}
              >
                <QuestionContent>
                  {/* 태그와 통계 */}
                  <QuestionFooter>
                    {/* 태그 */}
                    <TagList>
                      {question.tags && question.tags.length > 0 && (
                        question.tags.map((tag) => (
                          <Tag key={tag.id}>{tag.name}</Tag>
                        ))
                      )}
                    </TagList>

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
                  <QuestionExcerpt>{question.contentPreview}</QuestionExcerpt>

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
