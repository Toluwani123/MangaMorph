import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoutes';
import Layout from './components/layout';
import Dashboard from './pages/Dashboard';


function Logout () {
  localStorage.clear();
  return <Navigate to="/login" />
}

function RegisterandLogout () {
  localStorage.clear();
  return <Register />
}



function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterandLogout />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
