import React from 'react';
import { FiTrendingUp, FiMessageCircle, FiEye, FiThumbsUp, FiClock } from 'react-icons/fi';
import * as S from './Home.styled';

const samplePosts = [
  {
    id: 1,
    title: "React 18에서 새로 추가된 기능들에 대해 알아보세요",
    author: "개발자김씨",
    replies: 15,
    views: 234,
    likes: 8,
    time: "2시간 전",
    isHot: true
  },
  {
    id: 2,
    title: "TypeScript 프로젝트 초기 설정 가이드",
    author: "코딩러버",
    replies: 7,
    views: 156,
    likes: 12,
    time: "4시간 전"
  },
  {
    id: 3,
    title: "Next.js 13 App Router 마이그레이션 경험담",
    author: "풀스택개발자",
    replies: 23,
    views: 445,
    likes: 19,
    time: "6시간 전",
    isHot: true
  },
  {
    id: 4,
    title: "효율적인 Git 워크플로우 관리 방법",
    author: "버전관리마스터",
    replies: 11,
    views: 178,
    likes: 6,
    time: "8시간 전"
  },
  {
    id: 5,
    title: "Docker를 활용한 개발 환경 구축하기",
    author: "데브옵스엔지니어",
    replies: 9,
    views: 203,
    likes: 14,
    time: "10시간 전"
  },
  {
    id: 6,
    title: "Vue 3 Composition API 완벽 가이드",
    author: "프론트마스터",
    replies: 18,
    views: 312,
    likes: 25,
    time: "12시간 전",
    isHot: true
  },
  {
    id: 7,
    title: "Node.js 성능 최적화 노하우",
    author: "백엔드개발자",
    replies: 14,
    views: 267,
    likes: 21,
    time: "14시간 전",
    isHot: true
  },
  {
    id: 8,
    title: "CSS Grid vs Flexbox 언제 사용할까?",
    author: "웹디자이너",
    replies: 12,
    views: 189,
    likes: 16,
    time: "16시간 전",
    isHot: true
  },
  {
    id: 9,
    title: "Python 데이터 분석 시작하기",
    author: "데이터분석가",
    replies: 8,
    views: 145,
    likes: 11,
    time: "18시간 전"
  },
  {
    id: 10,
    title: "AWS 배포 자동화 구축 경험담",
    author: "클라우드엔지니어",
    replies: 16,
    views: 298,
    likes: 22,
    time: "20시간 전"
  }
];

function Home() {
  return (
    <S.MainContainer>
      <S.SectionsGrid>
        <S.Section>
          <S.SectionHeader>
            <FiTrendingUp color="#3b82f6" />
            <S.SectionTitle>인기 글</S.SectionTitle>
          </S.SectionHeader>
          <S.PostList>
            {samplePosts.filter(post => post.isHot).slice(0, 5).map(post => (
              <S.PostItem key={post.id}>
                <S.PostTitle>
                  {post.title} {post.isHot && <S.Badge>HOT</S.Badge>}
                </S.PostTitle>
                <S.PostMeta>
                  <span>{post.author}</span>
                  <S.MetaItem>
                    <FiMessageCircle size={12} />
                    {post.replies}
                  </S.MetaItem>
                  <S.MetaItem>
                    <FiEye size={12} />
                    {post.views}
                  </S.MetaItem>
                  <S.MetaItem>
                    <FiThumbsUp size={12} />
                    {post.likes}
                  </S.MetaItem>
                  <S.MetaItem>
                    <FiClock size={12} />
                    {post.time}
                  </S.MetaItem>
                </S.PostMeta>
              </S.PostItem>
            ))}
          </S.PostList>
        </S.Section>

        <S.Section>
          <S.SectionHeader>
            <FiMessageCircle color="#3b82f6" />
            <S.SectionTitle>최신 글</S.SectionTitle>
          </S.SectionHeader>
          <S.PostList>
            {samplePosts.slice(0, 5).map(post => (
              <S.PostItem key={post.id}>
                <S.PostTitle>
                  {post.title} {post.isHot && <S.Badge>HOT</S.Badge>}
                </S.PostTitle>
                <S.PostMeta>
                  <span>{post.author}</span>
                  <S.MetaItem>
                    <FiMessageCircle size={12} />
                    {post.replies}
                  </S.MetaItem>
                  <S.MetaItem>
                    <FiEye size={12} />
                    {post.views}
                  </S.MetaItem>
                  <S.MetaItem>
                    <FiThumbsUp size={12} />
                    {post.likes}
                  </S.MetaItem>
                  <S.MetaItem>
                    <FiClock size={12} />
                    {post.time}
                  </S.MetaItem>
                </S.PostMeta>
              </S.PostItem>
            ))}
          </S.PostList>
        </S.Section>
      </S.SectionsGrid>
    </S.MainContainer>
  );
}

export default Home;