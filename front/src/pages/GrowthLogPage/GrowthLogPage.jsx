import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  GrowthLogContainer,
  GrowthLogHeader,
  PageTitle,
  CreateButton,
  HeaderActions,
  ViewToggle,
  ViewToggleButton,
  FilterSection,
  FilterTabs,
  FilterTab,
  GrowthLogList,
  GrowthLogCard,
  GrowthLogCardImage,
  GrowthLogCardContent,
  GrowthLogTag,
  GrowthLogTitle,
  GrowthLogExcerpt,
  GrowthLogMeta,
  AuthorInfo,
  GrowthLogDate,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  Loading,
  CommentCount,
  LikeCount,
  GrowthLogInfoRow,
  TagList,
  Tag,
  SearchBox,
  SearchTypeSelect,
  SearchInput,
  SearchButton,
  VisibilityBadge,
  BadgeContainer,
} from './GrowthLogPage.styled';
import { growthLogService } from '../../api/services';

const GrowthLogPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [viewMode, setViewMode] = useState('ALL'); // ALL, MY
    const [sortType, setSortType] = useState('LATEST');

    const [growthLogs, setGrowthLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchType, setSearchType] = useState('TAG');

    // 마크다운 문법 제거 함수
    const stripMarkdown = (markdown) => {
        if (!markdown) return '';

        return markdown
            // 헤더 제거 (# ## ### 등)
            .replace(/^#{1,6}\s+/gm, '')
            // 굵은 글씨 제거 (**text** or __text__)
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/__([^_]+)__/g, '$1')
            // 기울임 제거 (*text* or _text_)
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/_([^_]+)_/g, '$1')
            // 취소선 제거 (~~text~~)
            .replace(/~~([^~]+)~~/g, '$1')
            // 링크 제거 [text](url)
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // 이미지 제거 ![alt](url)
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
            // 인라인 코드 제거 `code`
            .replace(/`([^`]+)`/g, '$1')
            // 코드 블록 제거
            .replace(/```[\s\S]*?```/g, '')
            // 인용구 제거 (>)
            .replace(/^>\s+/gm, '')
            // 리스트 제거 (- * +)
            .replace(/^[-*+]\s+/gm, '')
            // 숫자 리스트 제거 (1. 2. 등)
            .replace(/^\d+\.\s+/gm, '')
            // 구분선 제거 (---, ***, ___)
            .replace(/^[-*_]{3,}$/gm, '')
            // HTML 태그 제거
            .replace(/<[^>]+>/g, '')
            // 여러 줄바꿈을 하나로
            .replace(/\n{2,}/g, ' ')
            // 앞뒤 공백 제거
            .trim();
    };


    // viewMode나 sortType 변경 시 초기화
    useEffect(() => {
        setPage(0);
        setGrowthLogs([]);
        setHasMore(true);
        loadGrowthLogs(0, true);
    }, [viewMode, sortType]);

    // page 변경 시 추가 로드
    useEffect(() => {
        if (page > 0) {
            loadGrowthLogs(page, false);
        }
    }, [page]);

    // 무한 스크롤 이벤트
    useEffect(() => {
        const handleScroll = () => {
            if (loading || !hasMore) return;

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            // 스크롤이 끝에서 200px 전에 도달하면 다음 페이지 로드
            if (scrollTop + clientHeight >= scrollHeight - 200) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const loadGrowthLogs = async (pageNum, isInitial = false) => {
        if (loading) return;

        setLoading(true);
        try {
            const params = {
                page: pageNum,
                size: 20,
            };

            // API 호출
            let response;

            // 내 글 모드일 경우
            if (viewMode === 'MY') {
                params.status = 'PUBLISHED'; // 발행된 글만 표시

                // 정렬 조건 적용
                if (sortType === 'POPULAR') {
                    params.sort = 'voteCount,desc';
                } else {
                    params.sort = 'createdAt,desc';
                }

                response = await growthLogService.getMyGrowthLogs(params);
            } else if (searchKeyword.trim()) {
                // 검색어가 있는 경우: 검색 API 호출 (/api/v1/growth-logs/search)
                params.keyword = searchKeyword;
                params.searchType = searchType;

                // 정렬 조건 적용
                if (sortType === 'POPULAR') {
                    params.sort = 'voteCount,desc';
                } else {
                    params.sort = 'createdAt,desc';
                }

                response = await growthLogService.searchGrowthLogs(params);
            } else {
                // 목록 조회 (LATEST, POPULAR)
                if (sortType === 'POPULAR') {
                    params.sort = 'voteCount,desc';
                } else {
                    params.sort = 'createdAt,desc';
                }
                response = await growthLogService.getGrowthLogs(params);
            }

            // 응답 구조에 따라 데이터 설정 (Page 객체 가정)
            if (response && response.content) {
                if (isInitial) {
                    // 초기 로드: 데이터 교체
                    setGrowthLogs(response.content);
                } else {
                    // 추가 로드: 데이터 추가
                    setGrowthLogs(prev => [...prev, ...response.content]);
                }
                setTotalPages(response.totalPages);
                setHasMore(!response.last); // 마지막 페이지 체크
            } else if (Array.isArray(response)) {
                if (isInitial) {
                    setGrowthLogs(response);
                } else {
                    setGrowthLogs(prev => [...prev, ...response]);
                }
            }

        } catch (error) {
            console.error('성장기록 목록 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = () => {
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        navigate('/growth-logs/create');
    };

    const handleSortChange = (type) => {
        setSortType(type);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleSearch = () => {
        setPage(0);
        setGrowthLogs([]);
        setHasMore(true);
        loadGrowthLogs(0, true);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };



    return (
        <GrowthLogContainer>
            <GrowthLogHeader>
                <PageTitle>GrowthLog</PageTitle>
                <HeaderActions>
                    {isAuthenticated && (
                        <ViewToggle>
                            <ViewToggleButton
                                $active={viewMode === 'ALL'}
                                onClick={() => handleViewModeChange('ALL')}
                            >
                                모든 글
                            </ViewToggleButton>
                            <ViewToggleButton
                                $active={viewMode === 'MY'}
                                onClick={() => handleViewModeChange('MY')}
                            >
                                내 글
                            </ViewToggleButton>
                        </ViewToggle>
                    )}
                    {isAuthenticated && (
                        <CreateButton onClick={handleCreatePost}>글 쓰기</CreateButton>
                    )}
                </HeaderActions>
            </GrowthLogHeader>

            <FilterSection>
                <FilterTabs>
                    <FilterTab
                        $active={sortType === 'LATEST'}
                        onClick={() => handleSortChange('LATEST')}
                    >
                        최신순
                    </FilterTab>
                    <FilterTab
                        $active={sortType === 'POPULAR'}
                        onClick={() => handleSortChange('POPULAR')}
                    >
                        인기순
                    </FilterTab>
                </FilterTabs>

                <SearchBox>
                    <SearchTypeSelect
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="TAG">태그</option>
                        <option value="TITLE">제목</option>
                        <option value="CONTENT">내용</option>
                        <option value="AUTHOR">작성자</option>
                    </SearchTypeSelect>
                    <SearchInput
                        type="text"
                        placeholder="검색어를 입력하세요..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <SearchButton onClick={handleSearch}>검색</SearchButton>
                </SearchBox>
            </FilterSection>

            {loading && growthLogs.length === 0 ? (
                <Loading>성장기록을 불러오는 중...</Loading>
            ) : (sortType === 'FEED' && (!isAuthenticated || growthLogs.length === 0)) ? (
                <EmptyState>
                    <EmptyIcon>🔒</EmptyIcon>
                    <EmptyTitle>피드가 없습니다.</EmptyTitle>
                    <EmptyDescription>
                        인기 있는 성장기록들을 확인해보세요!
                    </EmptyDescription>
                    <CreateButton onClick={() => setSortType('POPULAR')}>인기 성장기록 보기</CreateButton>
                </EmptyState>
            ) : growthLogs.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>📝</EmptyIcon>
                    <EmptyTitle>아직 작성된 글이 없습니다</EmptyTitle>
                    <EmptyDescription>
                        첫 번째 글의 주인공이 되어보세요!
                    </EmptyDescription>
                    {isAuthenticated && (
                        <CreateButton onClick={handleCreatePost}>지금 글 쓰기</CreateButton>
                    )}
                </EmptyState>
            ) : (
                <>
                <GrowthLogList>
                    {growthLogs.map(post => (
                        <GrowthLogCard
                            key={post.id}
                            onClick={() => navigate(`/growth-logs/${post.id}`)}
                        >
                            {post.thumbnailUrl && <GrowthLogCardImage $src={post.thumbnailUrl} />}
                            <GrowthLogCardContent>
                                {/* 비공개 배지만 표시 */}
                                {post.visibility === 'PRIVATE' && (
                                    <BadgeContainer>
                                        <VisibilityBadge>비공개</VisibilityBadge>
                                    </BadgeContainer>
                                )}
                                {post.category && <GrowthLogTag>{post.category}</GrowthLogTag>}
                                <GrowthLogTitle>{post.title}</GrowthLogTitle>
                                <GrowthLogExcerpt>{stripMarkdown(post.summary || post.contentPreview)?.substring(0, 100)}...</GrowthLogExcerpt>
                                <GrowthLogInfoRow>
                                    <TagList>
                                        {post.tags && post.tags.slice(0, 3).map((tag, i) => (
                                            <Tag key={i}>{typeof tag === 'string' ? tag : tag.name}</Tag>
                                        ))}
                                    </TagList>
                                    <GrowthLogDate>{new Date(post.updatedAt || post.createdAt).toLocaleDateString()}</GrowthLogDate>
                                </GrowthLogInfoRow>
                                <GrowthLogMeta>
                                    <AuthorInfo>by {post.userNickname || 'Unknown'}</AuthorInfo>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CommentCount>💬 {post.commentCount || 0}</CommentCount>
                                        <LikeCount>♡ {post.voteCount || 0}</LikeCount>
                                    </div>
                                </GrowthLogMeta>
                            </GrowthLogCardContent>
                        </GrowthLogCard>
                    ))}
                </GrowthLogList>
                {loading && <Loading>더 많은 글을 불러오는 중...</Loading>}
                </>
            )}
        </GrowthLogContainer>
    );
};

export default GrowthLogPage;
