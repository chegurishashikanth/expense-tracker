import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // If login is successful
      alert(response.data.message); // e.g., "Login successful"
      setErrorMessage("");
      window.location.href = "/home"; // Redirect to dashboard or any other page
    } catch (error) {
      // Handle login errors
      setErrorMessage(
        error.response?.data?.message || "User does not exist or invalid credentials"
      );
    }
  };

  return (
    <div className="container">
      <div className="login-card">
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
          <h1>Welcome back!</h1>
          <p>Please enter your details</p>

          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="input"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="options">
              <label>
                <input type="checkbox" /> Remember for 30 days
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <p className="signup-text">
            Don’t have an account?{" "}
            <Link to="/register" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
