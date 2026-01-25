import React from 'react'
import Main from './features/layout/Main'
import { Route, Routes } from 'react-router-dom'
import Signin from './features/auth/components/Signin'
import Signup from './features/auth/components/Signup'
import RecruiterSignup from './features/auth/components/RecruiterSignup'
import Connection from './features/network/Connection'
import Invitation from './features/network/Invitation'
import Network from './features/network/Network'
import Message from './features/messaging/Message'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/recruiter/signup' element={<RecruiterSignup />} />
        <Route path='/main' element={<Main />} />
        <Route path='/connect' element={<Connection />} />
        <Route path="/invite" element={<Invitation />} />
        <Route path="/network" element={<Network />} />
        <Route path='/message' element={<Message />} />
      </Routes>
    </div>
  )
}

export default App
