import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Login from './components/auth/Login.jsx'
import Signup from './components/auth/Signup.jsx'
import Reports from './components/reports/Reports.jsx'
import CreateReport from './components/reports/CreateReport.jsx'
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/create" element={<CreateReport />} />
      </Routes>
    </div>
  )
}
