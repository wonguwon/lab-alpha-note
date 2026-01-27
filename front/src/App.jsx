import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import SocialSignupPage from './pages/SignupPage/SocialSignupPage';
import ProfilePage from './pages/ProfilePage';
import OAuth2RedirectPage from './pages/OAuth2RedirectPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import HabitPage from './pages/HabitPage';
import HabitCreatePage from './pages/HabitPage/HabitCreatePage';
import HabitDetailPage from './pages/HabitPage/HabitDetailPage';
import QnAPage, { AskQuestionPage, QuestionDetailPage, AnswerPage, EditQuestionPage, EditAnswerPage } from './pages/QnAPage';
import NotificationPage from './pages/NotificationPage';
import GoalPage from './pages/GoalPage';
import useAuthStore from './store/authStore';
import useNotificationStore from './store/notificationStore';
import { setAuthStoreGetter } from './api/axios';
import { authService } from './api/services';
import GrowthLogPage from './pages/GrowthLogPage/GrowthLogPage';
import GrowthLogCreatePage from './pages/GrowthLogPage/GrowthLogCreatePage';
import GrowthLogDetailPage from './pages/GrowthLogPage/GrowthLogDetailPage';
import GrowthLogEditPage from './pages/GrowthLogPage/GrowthLogEditPage';

function App() {
  const { user, setUser, logout, isAuthenticated } = useAuthStore();
  const { connectSSE, disconnectSSE } = useNotificationStore();

  // axios가 authStore에 접근할 수 있도록 설정
  useEffect(() => {
    setAuthStoreGetter(() => useAuthStore.getState());
  }, []);

  // 앱 시작 시 쿠키가 있으면 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const data = await authService.getUserInfo();
        setUser(data);
      } catch (error) {
        // 401 에러는 정상적인 상황 (로그인하지 않은 사용자)
        // 조용히 로그아웃 상태로만 설정 (에러 로그 출력하지 않음)
        if (error.response?.status === 401) {
          logout();
        } else {
          console.error('사용자 정보 로드 실패:', error);
        }
      }
    };

    loadUserInfo();
  }, [setUser, logout]); // user 의존성 제거하여 항상 초기 로드 시 확인

  // 로그인 상태에 따라 SSE 연결 관리
  useEffect(() => {
    if (isAuthenticated && user) {
      // 로그인 상태면 SSE 연결 시작
      connectSSE();
    } else {
      // 로그아웃 상태면 SSE 연결 종료
      disconnectSSE();
    }

    // 컴포넌트 언마운트 시 SSE 연결 정리
    return () => {
      disconnectSSE();
    };
  }, [isAuthenticated, user, connectSSE, disconnectSSE]);

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
          <Route path="/growth-logs" element={<GrowthLogPage />} />
          <Route path="/growth-logs/create" element={<ProtectedRoute><GrowthLogCreatePage /></ProtectedRoute>} />
          <Route path="/growth-logs/:id" element={<GrowthLogDetailPage />} />
          <Route path="/growth-logs/:id/edit" element={<ProtectedRoute><GrowthLogEditPage /></ProtectedRoute>} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/social" element={<SocialSignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><GoalPage /></ProtectedRoute>} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
