import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');

    if (!token || !userData) {
      navigate('/');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="home-container">
      <nav className="side-navbar">
        <div className="name">
          <h2>Welcome, {user.name}!</h2>
        </div>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#income">Income</a></li>
          <li><a href="#expenses">Expenses</a></li>
          <li><a href="#history">History</a></li>
        </ul>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
      <div className="content">
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default Home;