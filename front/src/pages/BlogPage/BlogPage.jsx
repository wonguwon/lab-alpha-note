import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  BlogContainer,
  BlogHeader,
  PageTitle,
  CreateButton,
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
  Tag
} from './BlogPage.styled';
import { blogService } from '../../api/services';

const BlogPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [sortType, setSortType] = useState('LATEST');


    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        loadBlogs();
    }, [sortType]);

    const loadBlogs = async () => {
        setLoading(true);
        try {
            const params = {
                page: 0, // 일단 첫 페이지만
                size: 20,
                sortType: sortType // LATEST, POPULAR, FEED 그대로 전달
            };
            
            // API 호출
            const response = await blogService.getBlogs(params);
            
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



    return (
        <BlogContainer>
            <BlogHeader>
                <PageTitle>Blog</PageTitle>
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
                    <FilterTab 
                        $active={sortType === 'FEED'}
                        onClick={() => handleSortChange('FEED')}
                    >
                        피드
                    </FilterTab>
                </FilterTabs>
                {isAuthenticated && (
                    <CreateButton onClick={handleCreatePost}>글 쓰기</CreateButton>
                )}

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
                        <BlogCard key={post.id} onClick={() => navigate(`/blogs/${post.id}`)}>
                            {post.thumbnailUrl && <BlogCardImage $src={post.thumbnailUrl} />}
                            <BlogCardContent>
                                {post.category && <BlogTag>{post.category}</BlogTag>}
                                <BlogTitle>{post.title}</BlogTitle>
                                <BlogExcerpt>{post.summary || post.contentPreview?.substring(0, 100)}...</BlogExcerpt>
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
