import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [incomeForm, setIncomeForm] = useState({
    name: "",
    date: "",
    amount: "",
    description: "",
  });
  const [expenseForm, setExpenseForm] = useState({
    name: "",
    date: "",
    amount: "",
    description: "",
  });
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(userData));
    fetchIncomes();
    fetchExpenses();
  }, [navigate]);

  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/income", {
        headers: { Authorization: token },
      });
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/expense", {
        headers: { Authorization: token },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingIncome) {
        await axios.put(
          `http://localhost:5000/api/income/${editingIncome._id}`,
          incomeForm,
          { headers: { Authorization: token } }
        );
        setEditingIncome(null);
      } else {
        await axios.post("http://localhost:5000/api/income", incomeForm, {
          headers: { Authorization: token },
        });
      }

      setIncomeForm({
        name: "",
        date: "",
        amount: "",
        description: "",
      });

      fetchIncomes();
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Error with income");
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingExpense) {
        await axios.put(
          `http://localhost:5000/api/expense/${editingExpense._id}`,
          expenseForm,
          { headers: { Authorization: token } }
        );
        setEditingExpense(null);
      } else {
        await axios.post("http://localhost:5000/api/expense", expenseForm, {
          headers: { Authorization: token },
        });
      }

      setExpenseForm({
        name: "",
        date: "",
        amount: "",
        description: "",
      });

      fetchExpenses();
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Error with expense");
    }
  };

  const handleIncomeEdit = (income) => {
    setEditingIncome(income);
    setIncomeForm({
      name: income.name,
      date: income.date.split("T")[0],
      amount: income.amount,
      description: income.description,
    });
  };

  const handleExpenseEdit = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      name: expense.name,
      date: expense.date.split("T")[0],
      amount: expense.amount,
      description: expense.description,
    });
  };

  const handleIncomeDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/income/${id}`, {
        headers: { Authorization: token },
      });
      fetchIncomes();
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting income");
    }
  };

  const handleExpenseDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/expense/${id}`, {
        headers: { Authorization: token },
      });
      fetchExpenses();
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting expense");
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + Number(item.amount), 0);
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
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#income"
              className={activeTab === "income" ? "active" : ""}
              onClick={() => setActiveTab("income")}
            >
              Income
            </a>
          </li>
          <li>
            <a
              href="#expenses"
              className={activeTab === "expenses" ? "active" : ""}
              onClick={() => setActiveTab("expenses")}
            >
              Expenses
            </a>
          </li>
          <li>
            <a
              href="#history"
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              History
            </a>
          </li>
        </ul>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            navigate("/");
          }}
          className="logout-button"
        >
          Logout
        </button>
      </nav>

      <div className="content">
        {activeTab === "income" && (
          <div className="income-section">
            <h2>Add New Income</h2>
            <div className="income-form-container">
              <form onSubmit={handleIncomeSubmit} className="income-form">
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Income Name"
                    value={incomeForm.name}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={incomeForm.date}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={incomeForm.amount}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, amount: e.target.value })
                    }
                    required
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    value={incomeForm.description}
                    onChange={(e) =>
                      setIncomeForm({
                        ...incomeForm,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit">
                  {editingIncome ? "Update Income" : "Add Income"}
                </button>
                {editingIncome && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIncome(null);
                      setIncomeForm({
                        name: "",
                        date: "",
                        amount: "",
                        description: "",
                      });
                    }}
                    className="cancel-button"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>

              <div className="total-summary">
                <h3>Total Income</h3>
                <p>${calculateTotal(incomes).toFixed(2)}</p>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="income-list">
              <h3>Recent Incomes</h3>
              {incomes.map((income) => (
                <div key={income._id} className="income-item">
                  <div className="income-name">
                    <h4>{income.name}</h4>
                  </div>
                  <div className="income-details">
                    <p>{new Date(income.date).toLocaleDateString()}</p>
                    <p>${parseFloat(income.amount).toFixed(2)}</p>
                    <p>{income.description}</p>
                  </div>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleIncomeEdit(income)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleIncomeDelete(income._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="expense-section">
            <h2>Add New Expense</h2>
            <div className="expense-form-container">
              <form onSubmit={handleExpenseSubmit} className="expense-form">
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Expense Name"
                    value={expenseForm.name}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={expenseForm.date}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={expenseForm.amount}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, amount: e.target.value })
                    }
                    required
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    value={expenseForm.description}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit">
                  {editingExpense ? "Update Expense" : "Add Expense"}
                </button>
                {editingExpense && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExpense(null);
                      setExpenseForm({
                        name: "",
                        date: "",
                        amount: "",
                        description: "",
                      });
                    }}
                    className="cancel-button"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>

              <div className="total-summary">
                <h3>Total Expenses</h3>
                <p>${calculateTotal(expenses).toFixed(2)}</p>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="expense-list">
              <h3>Recent Expenses</h3>
              {expenses.map((expense) => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-name">
                    <h4>{expense.name}</h4>
                  </div>
                  <div className="expense-details">
                    <p>{new Date(expense.date).toLocaleDateString()}</p>
                    <p>${parseFloat(expense.amount).toFixed(2)}</p>
                    <p>{expense.description}</p>
                  </div>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleExpenseEdit(expense)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleExpenseDelete(expense._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="overview-box">
            <div className="dashboard-summary">
              <div className="summary-card">
                <h3>Total Income</h3>
                <p>${calculateTotal(incomes).toFixed(2)}</p>
              </div>
              <div className="summary-card">
                <h3>Total Expenses</h3>
                <p>${calculateTotal(expenses).toFixed(2)}</p>
              </div>
              <div className="summary-card">
                <h3>Balance</h3>
                <p>
                  ${" "}
                  {(calculateTotal(incomes) - calculateTotal(expenses)).toFixed(
                    2
                  )}
                </p>
              </div>
            </div>
            <div className="visualization-section">
              <h3 className="visualization-heading">Visualization</h3>
              <select className="visualization-dropdown">
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-year">This Year</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
