import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Community from './pages/Community';
import Knowledge from './pages/Knowledge';
import Notice from './pages/Notice';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
`;

const MainWrapper = styled.main`
  flex: 1;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <MainWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/community" element={<Community />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/notice" element={<Notice />} />
          </Routes>
        </MainWrapper>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App;
