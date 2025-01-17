import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import Graph from "./pages/Graph";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "pages/Profile";
import Fiscalite from "pages/Fiscalite";

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fiscalite"
          element={
            // <ProtectedRoute>
            <Fiscalite />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/graph"
          element={
            // <ProtectedRoute>
            <Graph />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
