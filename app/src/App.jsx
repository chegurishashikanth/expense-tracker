import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./assets/Login";
import Register from "./assets/Register";
import Home from "./assets/Home";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Page */}
        <Route path="/register" element={<Register />} /> {/* Register Page */}
        <Route path="/home" element={<Home />} /> {/* Register Page */}
      </Routes>
    </Router>
  );
};

export default App;
