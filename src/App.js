// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import OAuthCallback from "./pages/OAuthCallback";
import GoogleCallback from "./pages/GoogleCallback";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import AdminAddSession from "./pages/AdminAddSession";
import AdminSessionsList from "./pages/AdminSessionsList";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/admin/" element={<AdminAddSession />} />
      <Route path="/admin/sessions" element={<AdminSessionsList />} />

      {/* App Pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/admin/" element={<AdminAddSession />} />
      <Route path="/admin/sessions" element={<AdminSessionsList />} />
    </Routes>
  );
}

export default App;
