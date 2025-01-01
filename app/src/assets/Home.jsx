import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [name, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Debugging response
        console.log('API Response:', response.data);

        // Set username if it exists in the response
        setUsername(response.data.name || 'Guest');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="home-container">
      <nav className="side-navbar">
        <div className="name">
          <h2>Welcome, {name || 'Guest'}!</h2>
        </div>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#income">Income</a></li>
          <li><a href="#expenses">Expenses</a></li>
          <li><a href="#history">History</a></li>
        </ul>
      </nav>
      <div className="content">
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default Home;
