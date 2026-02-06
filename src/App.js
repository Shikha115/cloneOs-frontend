import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import MyProjects from "./pages/MyProjects/Page";
import LandingPage from "./pages/Home/Page";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Waitlist from "./pages/Waitlist";
import { useAuthStore } from "./store/auth.store";
import { useDashboardStore } from "./store/dashboard.store";
import Header from "./pages/Layout/Header";
import Footer from "./pages/Layout/Footer";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const setSidebarOpen = useDashboardStore((state) => state.setSidebarOpen);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = (e) => {
      setSidebarOpen(e.matches);
    };

    // Listen for screen size changes
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [setSidebarOpen]);

  return (
    <BrowserRouter>
      <div className="home-pages">
        <Routes>
          <Route
            element={
              <>
                <Header />
                <main>
                  <Outlet />
                </main>
                <Footer />
              </>
            }
          >
                   <Route path="/" element={<LandingPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/waitlist" element={<Waitlist />} />
        </Routes>
      </div>
      <div className="App">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-projects"
            element={
              <ProtectedRoute>
                <MyProjects />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
