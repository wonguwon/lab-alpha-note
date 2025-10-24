import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OAuth2RedirectPage from './pages/OAuth2RedirectPage';
import useAuthStore from './store/authStore';
import { setAuthStoreGetter } from './api/axios';

function App() {
  // axios가 authStore에 접근할 수 있도록 설정
  useEffect(() => {
    setAuthStoreGetter(() => useAuthStore.getState());
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
