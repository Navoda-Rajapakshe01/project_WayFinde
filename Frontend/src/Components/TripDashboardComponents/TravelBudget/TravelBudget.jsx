import React, { useState, useEffect } from 'react';
import './TravelBudget.css';
import axios from 'axios';  // Importing Axios for API calls

const TravelBudget = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch expenses data from the backend
  useEffect(() => {
    axios.get('http://localhost:5030/api/TravelBudget')  // Change the URL as per your API
      .then((res) => {
        setExpenses(res.data); // Set the fetched expenses into the state
      })
      .catch((err) => {
        console.error("GET error: ", err); // Handle errors
      });
  }, []);

  // Add new expense to the backend
  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      axios.post('http://localhost:5030/api/TravelBudget', newExpense)  // Send POST request to backend
        .then((res) => {
          setExpenses([...expenses, res.data]); // Update state with the new expense
          setNewExpense({ description: '', amount: '' }); // Reset input fields
        })
        .catch((err) => {
          console.error("POST error: ", err); // Handle errors
        });
    }
  };

  // Delete an expense from the backend
  const handleDeleteExpense = (id) => {
    axios.delete(`http://localhost:5030/api/TravelBudget/${id}`)  // Send DELETE request to backend
      .then(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id));  // Remove deleted expense from the state
      })
      .catch((err) => {
        console.error("DELETE error: ", err); // Handle errors
      });
  };

  return (
    <div className="travel-budget-container">
      <h2 className="budget-plan-title">BUDGET PLAN</h2>
      <p className="budget-plan-description">
        Add your expenses one by one to calculate your total trip budget
      </p>

      <div className="budget-title">Travel Budget</div>

        {/* Input Section */}
    <div className="budget-inputs">
      <input
        type="text"
        placeholder="Expense description"
        value={newExpense.description}
        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
        className="description-input"
      />
      <input
        type="number"
        placeholder="Amount"
        value={newExpense.amount}
        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        className="amount-input"
      />
      <button onClick={handleAddExpense} className="add-expense-button">Add</button>
    </div>

      {/* Expense List */}
      <ul className="expenses-list">
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-item">
            <span className="expense-description">{expense.description}</span>
            <span className="expense-amount">Rs : {expense.amount}</span>
            <button onClick={() => handleDeleteExpense(expense.id)} className="delete-expense-button">X</button>
          </li>
        ))}
      </ul>

    {/* Total Budget */}
    <div className="total-amount">
    <span className="total-label">Total Budget:</span> 
    <span className="total-value">Rs {expenses.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0)}</span>
  </div>
      </div>
    );
};

export default TravelBudget;