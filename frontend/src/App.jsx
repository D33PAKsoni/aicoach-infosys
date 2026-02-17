import React from 'react'
import { Landing } from './pages/Landing.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from './pages/OAuthSuccess';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Interview from './pages/Interview.jsx';
import InterviewInstructions from './pages/InterviewInstructions';


export const App = () => {
  return (
    <div>
      {/* <Landing /> */}
      <AuthProvider>
        <BrowserRouter>
           <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/oauth-success" element={<OAuthSuccess/>}/>
            <Route path="/dashboard"element={<ProtectedRoute> <Dashboard /></ProtectedRoute>}/>
            <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>}/>
            <Route path="/instructions" element={<ProtectedRoute> <InterviewInstructions /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}




