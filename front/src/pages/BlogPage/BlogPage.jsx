import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  BlogContainer,
  BlogHeader,
  PageTitle,
  CreateButton,
  HeaderActions,
  ViewToggle,
  ViewToggleButton,
  FilterSection,
  FilterTabs,
  FilterTab,
  BlogList,
  BlogCard,
  BlogCardImage,
  BlogCardContent,
  BlogTag,
  BlogTitle,
  BlogExcerpt,
  BlogMeta,
  AuthorInfo,
  BlogDate,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  Loading,
  CommentCount,
  LikeCount,
  BlogInfoRow,
  TagList,
  Tag,
  SearchBox,
  SearchTypeSelect,
  SearchInput,
  SearchButton,
  VisibilityBadge,
  BadgeContainer,
} from './BlogPage.styled';
import { blogService } from '../../api/services';

const BlogPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [viewMode, setViewMode] = useState('ALL'); // ALL, MY
    const [sortType, setSortType] = useState('LATEST');

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
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


    useEffect(() => {
        loadBlogs();
    }, [viewMode, sortType]);

    const loadBlogs = async () => {
        setLoading(true);
        try {
            const params = {
                page: 0,
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

                response = await blogService.getMyBlogs(params);
            } else if (searchKeyword.trim()) {
                // 검색어가 있는 경우: 검색 API 호출 (/api/v1/blogs/search)
                params.keyword = searchKeyword;
                params.searchType = searchType;

                // 정렬 조건 적용
                if (sortType === 'POPULAR') {
                    params.sort = 'voteCount,desc';
                } else {
                    params.sort = 'createdAt,desc';
                }

                response = await blogService.searchBlogs(params);
            } else {
                // 목록 조회 (LATEST, POPULAR)
                if (sortType === 'POPULAR') {
                    params.sort = 'voteCount,desc';
                } else {
                    params.sort = 'createdAt,desc';
                }
                response = await blogService.getBlogs(params);
            }

            // 응답 구조에 따라 데이터 설정 (Page 객체 가정)
            if (response && response.content) {
                setBlogs(response.content);
                setTotalPages(response.totalPages);
            } else if (Array.isArray(response)) {
                 setBlogs(response);
            }

        } catch (error) {
            console.error('블로그 목록 조회 실패:', error);
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
        navigate('/blogs/create');
    };

    const handleSortChange = (type) => {
        setSortType(type);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleSearch = () => {
        setPage(0);
        loadBlogs();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };



    return (
        <BlogContainer>
            <BlogHeader>
                <PageTitle>Blog</PageTitle>
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
            </BlogHeader>

            <FilterSection>
                <FilterTabs>
                    <FilterTab
                        $active={sortType === 'LATEST'}
                        onClick={() => handleSortChange('LATEST')}
                    >
                        최근
                    </FilterTab>
                    <FilterTab
                        $active={sortType === 'POPULAR'}
                        onClick={() => handleSortChange('POPULAR')}
                    >
                        인기
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

            {loading ? (
                <Loading>블로그 글을 불러오는 중...</Loading>
            ) : blogs.length === 0 ? (
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
                <BlogList>
                    {blogs.map(post => (
                        <BlogCard
                            key={post.id}
                            onClick={() => navigate(`/blogs/${post.id}`)}
                        >
                            {post.thumbnailUrl && <BlogCardImage $src={post.thumbnailUrl} />}
                            <BlogCardContent>
                                {/* 비공개 배지만 표시 */}
                                {post.visibility === 'PRIVATE' && (
                                    <BadgeContainer>
                                        <VisibilityBadge>비공개</VisibilityBadge>
                                    </BadgeContainer>
                                )}
                                {post.category && <BlogTag>{post.category}</BlogTag>}
                                <BlogTitle>{post.title}</BlogTitle>
                                <BlogExcerpt>{stripMarkdown(post.summary || post.contentPreview)?.substring(0, 100)}...</BlogExcerpt>
                                <BlogInfoRow>
                                    <TagList>
                                        {post.tags && post.tags.slice(0, 3).map((tag, i) => (
                                            <Tag key={i}>{typeof tag === 'string' ? tag : tag.name}</Tag>
                                        ))}
                                    </TagList>
                                    <BlogDate>{new Date(post.updatedAt || post.createdAt).toLocaleDateString()}</BlogDate>
                                </BlogInfoRow>
                                <BlogMeta>
                                    <AuthorInfo>by {post.userNickname || 'Unknown'}</AuthorInfo>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CommentCount>💬 {post.commentCount || 0}</CommentCount>
                                        <LikeCount>♡ {post.voteCount || 0}</LikeCount>
                                    </div>
                                </BlogMeta>
                            </BlogCardContent>
                        </BlogCard>
                    ))}
                </BlogList>
            )}
        </BlogContainer>
    );
};

export default BlogPage;
