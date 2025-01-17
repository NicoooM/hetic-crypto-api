import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }

    try {
      const { email, password, name } = formData;

      await API.post("/auth/register", { email, password, name });
      navigate("/login");
    } catch (error: any) {
      let errorMessage = "Registration failed.";

      try {
        JSON.parse(error.response?.data?.message);

        errorMessage =
          JSON.parse(error.response?.data?.message)[0]?.message ||
          "Registration failed.";
      } catch (e) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      setErrors(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-60px)]">
      <div className="w-full max-w-md p-4 space-y-6 bg-white border border-gray-200 rounded-lg">
        <h1 className="text-2xl font-bold">Register</h1>

        {errors && <div className="text-red-500">{errors}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="example@email.com"
            />
          </div>

          {/* UserName */}
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="John Doe"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Confirm your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
