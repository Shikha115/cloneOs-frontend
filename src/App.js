import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import MyProjects from "./pages/MyProjects/Page";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHeader from "./pages/Dashboard/components/DashboardHeader";
import { useAuthStore } from "./store/auth.store";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return (
    <div className="App">
      <BrowserRouter>
        {/* Global Header - shown on all pages when authenticated */}
        {isAuthenticated && <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></ProtectedRoute>} />
          <Route path="/my-projects" element={<ProtectedRoute><MyProjects sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

