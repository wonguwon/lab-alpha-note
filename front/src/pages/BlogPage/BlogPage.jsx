import React, { useState } from 'react';
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
  EmptyDescription
} from './BlogPage.styled';

const BlogPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [sortType, setSortType] = useState('LATEST');


    // 임시 데이터 (나중에 API 연동 시 교체)
    const blogPosts = [
        // {
        //     id: 1,
        //     title: '첫 번째 블로그 글',
        //     excerpt: '이것은 블로그 글의 요약입니다. 내용을 확인할 수 있습니다.',
        //     author: 'User1',
        //     createdAt: '2025-01-13',
        //     tag: '일상',
        //     image: ''
        // }
    ];

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
                        $active={sortType === 'FEED'}
                        onClick={() => handleSortChange('FEED')}
                    >
                        피드
                    </FilterTab>
                    <FilterTab 
                        $active={sortType === 'POPULAR'}
                        onClick={() => handleSortChange('POPULAR')}
                    >
                        인기
                    </FilterTab>
                </FilterTabs>
                {isAuthenticated && (
                    <CreateButton onClick={handleCreatePost}>글 쓰기</CreateButton>
                )}

            </FilterSection>

            {blogPosts.length === 0 ? (
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
                    {blogPosts.map(post => (
                        <BlogCard key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
                            <BlogCardImage $src={post.image} />
                            <BlogCardContent>
                                <BlogTag>{post.tag}</BlogTag>
                                <BlogTitle>{post.title}</BlogTitle>
                                <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                                <BlogMeta>
                                    <AuthorInfo>by {post.author}</AuthorInfo>
                                    <BlogDate>{post.createdAt}</BlogDate>
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
