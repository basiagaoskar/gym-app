import { Navigate, Route, Routes } from 'react-router-dom';

import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { useThemeStore } from './store/useThemeStore';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const { theme } = useThemeStore();

  const loggedIn = false;

  return (
    <>
      <div data-theme={theme} >
        <Routes>
          <Route path="/" element={loggedIn ? <HomePage /> : <Navigate to="/start" />} />
          <Route path="/login" element={!loggedIn ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!loggedIn ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={loggedIn ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/settings" element={loggedIn ? <SettingsPage /> : <Navigate to="/" />} />
          <Route path="/start" element={<StartPage />} />
        </Routes >

        <Toaster />
      </div>
    </>
  )
}

export default App