import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Login = () => {
  //const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(email, password);
    } catch (error) {
      console.error("Login failed");
    }
  };

  //   const user = false; // temporaire pour test

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-60px)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-4 space-y-6 bg-white border border-gray-200 rounded-lg"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-hover"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
