import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import OAuth2RedirectPage from './pages/OAuth2RedirectPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import HabitPage from './pages/HabitPage';
import HabitCreatePage from './pages/HabitPage/HabitCreatePage';
import HabitDetailPage from './pages/HabitPage/HabitDetailPage';
import QnAPage, { AskQuestionPage, QuestionDetailPage, AnswerPage, EditQuestionPage, EditAnswerPage } from './pages/QnAPage';
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
          <Route path="/qna/ask" element={<ProtectedRoute><AskQuestionPage /></ProtectedRoute>} />
          <Route path="/habits" element={<HabitPage />} />
          <Route path="/habits/create" element={<ProtectedRoute><HabitCreatePage /></ProtectedRoute>} />
          <Route path="/habits/:habitId" element={<HabitDetailPage />} />
          <Route path="/qna/:id" element={<QuestionDetailPage />} />
          <Route path="/qna/:id/edit" element={<ProtectedRoute><EditQuestionPage /></ProtectedRoute>} />
          <Route path="/qna/:id/answer" element={<ProtectedRoute><AnswerPage /></ProtectedRoute>} />
          <Route path="/qna/:id/answer/:answerId/edit" element={<ProtectedRoute><EditAnswerPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
