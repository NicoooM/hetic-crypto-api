import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const token = window.location.pathname.split("/").pop();
      const { data } = await API.get(`/auth/verify-email/${token}`);
      setMessage(data.message);
    } catch (error) {
      setMessage("Email verification failed.");
    }
  };

  useEffect(() => {
    verifyEmail();
    navigate("/login");
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Verifying Email...</h1>

      {/* <button
        onClick={verifyEmail}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Verify Email
      </button> */}

      {message && <div className="text-center">{message}</div>}
    </div>
  );
};

export default VerifyEmail;
