import React, { useState } from 'react';
import './TravelBudget.css'; 

const TravelBudget = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([...expenses, newExpense]);
      setNewExpense({ description: '', amount: '' });
    }
  };

  const handleDeleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="travel-budget-container">

      {/* Header Section */}
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
          className="budget-input description-input"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          className="budget-input amount-input"
        />
        <button onClick={handleAddExpense} className="add-expense-button">Add</button>
      </div>

      {/* Expense List */}
      <ul className="expenses-list">
        {expenses.map((expense, index) => (
          <li key={index} className="expense-item">
            <span className="expense-description">{expense.description}</span>
            <span className="expense-amount">Rs :{expense.amount}</span>
            <button onClick={() => handleDeleteExpense(index)} className="delete-expense-button">X</button>
          </li>
        ))}
      </ul>

      {/* Total Budget */}
      <div className="total-amount">
        Total Budget: Rs
        {expenses.reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0)}
      </div>

    </div>
  );
};

export default TravelBudget;
