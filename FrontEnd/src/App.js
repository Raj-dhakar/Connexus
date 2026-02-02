import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Main from './features/layout/Main';
import { Route, Routes, useLocation } from 'react-router-dom';
import Signin from './features/auth/components/Signin';
import Signup from './features/auth/components/Signup';
import RecruiterSignup from './features/auth/components/RecruiterSignup';
import Connection from './features/network/Connection';
import Invitation from './features/network/Invitation';
import Network from './features/network/Network';
import Message from './features/messaging/Message';
import RecruiterDashboard from './features/recruiter/RecruiterDashboard';
import TestProfile from './features/profile/components/TestProfile';
import UserPosts from './features/posts/components/UserPosts';
import AdminDashboard from './features/admin/AdminDashboard';
import UserManagement from './features/admin/UserManagement';
import ContentModeration from './features/admin/ContentModeration';
import { AnimatePresence } from 'framer-motion';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAuth, { AuthProvider } from './features/auth/useAuth';

function App() {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path='/' element={<Signin />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/recruiter/signup' element={<RecruiterSignup />} />
              <Route path='/main' element={<Main />} />
              <Route path='/connect' element={<Connection />} />
              <Route path="/invite" element={<Invitation />} />
              <Route path="/network" element={<Network />} />
              <Route path='/message' element={<Message />} />
              <Route path='/my-posts' element={<UserPosts />} />
              <Route path='/recruiter/dashboard' element={<RecruiterDashboard />} />
              <Route path='/test-profile' element={<TestProfile />} />

              {/* Admin Routes */}
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
              <Route path='/admin/users' element={<UserManagement />} />
              <Route path='/admin/recruiters' element={<UserManagement />} /> {/* Reusing UserManagement for now */}
              <Route path='/admin/moderation' element={<ContentModeration />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App
