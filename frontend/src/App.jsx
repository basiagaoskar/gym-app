import { Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { theme } = useThemeStore();
  return (
    <>
      <div data-theme={theme} >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes >
      </div>
    </>
  )
}

export default App