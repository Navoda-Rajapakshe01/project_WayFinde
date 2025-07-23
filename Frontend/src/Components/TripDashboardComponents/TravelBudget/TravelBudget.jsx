import React, { useState, useEffect } from "react";
import "./TravelBudget.css";
import axios from "axios"; // Importing Axios for API calls

const TravelBudget = ({ tripId, sharedMode = false }) => {
  console.log("TravelBudget received tripId:", tripId); // Debug log
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  // Fetch expenses data from the backend
  useEffect(() => {
    console.log("Fetching budgets for tripId:", tripId); // Debug log
    if (tripId) {
      axios
        .get(`http://localhost:5030/api/TravelBudget/trip/${tripId}`) // Use tripId in the API endpoint
        .then((res) => {
          console.log("Received budgets:", res.data); // Debug log
          setExpenses(res.data);
        })
        .catch((err) => {
          console.error("GET error: ", err);
        });
    }
  }, [tripId]);

  // Add new expense to the backend
  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expenseData = {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        tripId: parseInt(tripId), // Use tripId from props
      };
      console.log("Adding new budget:", expenseData); // Debug log

      axios
        .post("http://localhost:5030/api/TravelBudget", expenseData)
        .then((res) => {
          console.log("Budget added successfully:", res.data); // Debug log
          setExpenses([...expenses, res.data]);
          setNewExpense({ description: "", amount: "" });
        })
        .catch((err) => {
          console.error("POST error: ", err);
          console.error("Error details:", err.response?.data); // More error details
        });
    }
  };

  // Delete an expense from the backend
  const handleDeleteExpense = (id) => {
    axios
      .delete(`http://localhost:5030/api/TravelBudget/${id}`)
      .then(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
      })
      .catch((err) => {
        console.error("DELETE error: ", err);
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
          onChange={(e) =>
            setNewExpense({ ...newExpense, description: e.target.value })
          }
          className="description-input"
          disabled={sharedMode}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          className="amount-input"
          disabled={sharedMode}
        />
        <button
          onClick={handleAddExpense}
          className="add-expense-button"
          disabled={sharedMode}
        >
          Add
        </button>
      </div>

      {/* Expense List */}
      <ul className="expenses-list">
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-item">
            <span className="expense-description">{expense.description}</span>
            <span className="expense-amount">Rs : {parseFloat(expense.amount).toFixed(2)}</span>
            <button
              onClick={() => handleDeleteExpense(expense.id)}
              className="delete-expense-button"
              disabled={sharedMode}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      {/* Total Budget */}
      <div className="total-amount">
        <span className="total-label">Total Budget:</span> 
        <span className="total-value">
         Rs {expenses.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default TravelBudget;
