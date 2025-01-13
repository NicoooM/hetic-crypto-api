import React from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import API from "services/api";

const Navbar = () => {
    // const { user, logout } = useAuth();
    const user = false; // temporaire pour test

    const handleLogout = async () => {
        // await API.delete("/auth/logout");
        // logout();
        // localStorage.removeItem("token");
        console.log("Logout clicked");
    }

    return (
        <nav className="p-4 flex justify-between bg-transparent bg-white">
            <Link to="/" className="font-bold font-mono text-lg">Monolith</Link>
            <div>
                {user ? (
                    <>
                        <Link to="/dashboard" className="mr-4">Dashboard</Link>
                        <Link to="/profile" className="mr-4">Profile</Link>
                        <button onClick={handleLogout} className="bg-primary px-4 py-2 rounded text-white font-mono">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4">Login</Link>
                        <Link to="/register" className="bg-primary px-4 py-2 rounded text-white font-mono">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
