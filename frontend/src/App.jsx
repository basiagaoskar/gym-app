import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { theme } = useThemeStore();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [useLocation().pathname, checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div data-theme={theme} className='bg-base-200 flex items-center justify-center h-screen'>
        <Loader2 className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <>
      <div data-theme={theme} >
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/start" />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="/user/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes >

        <Toaster />
      </div>
    </>
  )
}

export default App