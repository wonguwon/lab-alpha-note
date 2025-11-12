import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import OAuth2RedirectPage from './pages/OAuth2RedirectPage';
import QnAPage, { AskQuestionPage, QuestionDetailPage } from './pages/QnAPage';
import useAuthStore from './store/authStore';
import { setAuthStoreGetter } from './api/axios';
import { authService } from './api/services';

function App() {
  const { token, setUser, logout } = useAuthStore();

  // axios가 authStore에 접근할 수 있도록 설정
  useEffect(() => {
    setAuthStoreGetter(() => useAuthStore.getState());
  }, []);

  // 앱 시작 시 토큰이 있으면 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      if (token) {
        try {
          const data = await authService.getUserInfo();
          setUser(data);
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
          // 토큰이 만료되었거나 유효하지 않으면 로그아웃
          logout();
        }
      }
    };

    loadUserInfo();
  }, [token, setUser, logout]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qna" element={<QnAPage />} />
          <Route path="/qna/ask" element={<AskQuestionPage />} />
          <Route path="/qna/:id" element={<QuestionDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
