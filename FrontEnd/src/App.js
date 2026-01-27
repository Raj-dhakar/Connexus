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
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
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
            <Route path='/recruiter/dashboard' element={<RecruiterDashboard />} />
          </Routes>
        </AnimatePresence>
      </Box>
    </ThemeProvider>
  );
}

export default App
