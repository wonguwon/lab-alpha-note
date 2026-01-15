import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdArrowBack } from 'react-icons/md';
import { IoPersonCircle } from 'react-icons/io5';
import { blogService } from '../../api/services';
import useAuthStore from '../../store/authStore';
import {
  DetailContainer,
  BackButton,
  BlogCard,
  BlogHeader,
  BlogTitle,
  BlogMeta,
  AuthorInfo,
  AuthorAvatar,
  AuthorName,
  MetaDivider,
  TimeStamp,
  BlogImage,
  BlogBody,
  TagList,
  Tag,
  ActionBar,
  ActionButtons,
  ActionButton,
  EmptyState,
  LoadingState
} from './BlogDetailPage.styled';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlogDetail();
  }, [id]);

  const loadBlogDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getBlog(id);
      setBlog(data);
    } catch (err) {
      console.error('블로그 상세 조회 실패:', err);
      setError(err.response?.data?.message || '블로그 글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/blogs/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await blogService.deleteBlog(id);
      alert('글이 삭제되었습니다.');
      navigate('/blogs');
    } catch (err) {
      console.error('블로그 삭제 실패:', err);
      alert(err.response?.data?.message || '글 삭제에 실패했습니다.');
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
          <BackButton onClick={() => navigate('/blogs')}>목록으로 돌아가기</BackButton>
        </EmptyState>
      </DetailContainer>
    );
  }

  if (!blog) {
    return (
      <DetailContainer>
        <EmptyState>
          <h3>글을 찾을 수 없습니다</h3>
          <BackButton onClick={() => navigate('/blogs')}>목록으로 돌아가기</BackButton>
        </EmptyState>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/blogs')}>
        <MdArrowBack /> 목록으로
      </BackButton>

      <BlogCard>
        {blog.thumbnailUrl && <BlogImage src={blog.thumbnailUrl} alt={blog.title} />}
        
        <BlogHeader>
          <BlogTitle>{blog.title}</BlogTitle>
          <BlogMeta>
            <AuthorInfo>
              {blog.profileImageUrl ? (
                <AuthorAvatar
                  src={blog.profileImageUrl}
                  alt={blog.userNickname}
                />
              ) : (
                <IoPersonCircle size={36} color="#9ca3af" />
              )}
              <AuthorName>{blog.userNickname || 'Unknown'}</AuthorName>
            </AuthorInfo>
            <MetaDivider>|</MetaDivider>
            <TimeStamp>{formatTimeAgo(blog.createdAt, blog.updatedAt)}</TimeStamp>
          </BlogMeta>

          {blog.tags && blog.tags.length > 0 && (
            <TagList>
                {blog.tags.map((tag, index) => (
                    <Tag key={index}>{typeof tag === 'string' ? tag : tag.name}</Tag>
                ))}
            </TagList>
          )}
        </BlogHeader>

        <BlogBody dangerouslySetInnerHTML={{ __html: blog.content }} />

        {isAuthenticated && user?.id === blog.userId && (
          <ActionBar>
             {/* Left side spacer or additional actions (like stats) could go here if needed */}
             <div /> 
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
          </ActionBar>
        )}
      </BlogCard>
    </DetailContainer>
  );
};

export default BlogDetailPage;
