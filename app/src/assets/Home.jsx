import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incomeForm, setIncomeForm] = useState({
    name: '',
    date: '',
    amount: '',
    description: ''
  });
  const [incomes, setIncomes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');

    if (!token || !userData) {
      navigate('/');
      return;
    }

    setUser(JSON.parse(userData));
    fetchIncomes();
  }, [navigate]);

  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/income', {
        headers: { Authorization: token }
      });
      setIncomes(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/income',
        incomeForm,
        { headers: { Authorization: token } }
      );
      
      setIncomeForm({
        name: '',
        date: '',
        amount: '',
        description: ''
      });
      
      fetchIncomes();
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding income');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const handleIncomeChange = (e) => {
    setIncomeForm({
      ...incomeForm,
      [e.target.name]: e.target.value
    });
  };

  if (!user) return null;

  return (
    <div className="home-container">
      <nav className="side-navbar">
        <div className="name">
          <h2>Welcome, {user.name}!</h2>
        </div>
        <ul>
          <li>
            <a 
              href="#dashboard" 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#income" 
              className={activeTab === 'income' ? 'active' : ''}
              onClick={() => setActiveTab('income')}
            >
              Income
            </a>
          </li>
          <li>
            <a 
              href="#expenses" 
              className={activeTab === 'expenses' ? 'active' : ''}
              onClick={() => setActiveTab('expenses')}
            >
              Expenses
            </a>
          </li>
          <li>
            <a 
              href="#history" 
              className={activeTab === 'history' ? 'active' : ''}
              onClick={() => setActiveTab('history')}
            >
              History
            </a>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
      
      <div className="content">
        {activeTab === 'income' && (
          <div className="income-section">
            <h2>Add New Income</h2>
            <form onSubmit={handleIncomeSubmit} className="income-form">
              <input
                type="text"
                name="name"
                placeholder="Income Name"
                value={incomeForm.name}
                onChange={handleIncomeChange}
                required
              />
              <input
                type="date"
                name="date"
                value={incomeForm.date}
                onChange={handleIncomeChange}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={incomeForm.amount}
                onChange={handleIncomeChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={incomeForm.description}
                onChange={handleIncomeChange}
                required
              />
              <button type="submit">Add Income</button>
            </form>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="income-list">
              <h3>Recent Incomes</h3>
              {incomes.map((income) => (
                <div key={income._id} className="income-item">
                  <h4>{income.name}</h4>
                  <p>Date: {new Date(income.date).toLocaleDateString()}</p>
                  <p>Amount: ${income.amount}</p>
                  <p>Description: {income.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <div className="overview-box">
            <h2>All Transactions</h2>
            {/* Add chart or content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;