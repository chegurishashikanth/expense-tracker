import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send data to the backend
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Show a success alert and redirect to login
      alert(response.data.message);
      setError("");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      window.location.href = "http://localhost:5174/"; // Replace "/login" with your login page route
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container">
      <div className="register-card">
        {/* Left Section */}
        <div className="left-section">
          <div className="shapes">
            <div className="circle">😊</div>
            <div className="rectangle purple"></div>
            <div className="rectangle black"></div>
            <div className="rectangle yellow"></div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <h1>Welcome!</h1>
          <p>Create your account</p>

          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              required
            />

            <button type="submit" className="register-button">
              Sign Up
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}

          <p className="login-text">
            Already have an account?{" "}
            <a href="/" className="login-link">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
