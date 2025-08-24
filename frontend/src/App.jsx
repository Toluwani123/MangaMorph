import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoutes';
import Layout from './components/layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Projects from './pages/Projects';
import Editor from './pages/Editor';
import ChapterViewer from './pages/ChapterViewer';


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
          <Route path="/upload" element={<Upload />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/edit" element={<Editor />} />
          <Route path="/chapter/:chapterId" element={<ChapterViewer />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
