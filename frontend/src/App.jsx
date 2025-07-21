import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Integrations from './pages/Integrations'
import './App.css'
import Dashboard from './pages/Dashboard'

function Logout () {
  localStorage.clear();
  return <Navigate to="/login" />
}

function RegisterandLogout () {
  localStorage.clear();
  return <Navigate to="/register" />
}



function App() {

  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/integrations" element={
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  )
}

export default App
