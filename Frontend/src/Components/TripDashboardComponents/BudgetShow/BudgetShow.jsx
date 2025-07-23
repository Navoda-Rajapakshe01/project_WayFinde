import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ✅ Import axios
import { X } from 'lucide-react';
import './BudgetShow.css';

const BudgetShow = ({ onClose, tripId }) => {
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);

  // ✅ Fetch expenses from backend
  useEffect(() => {
    if (tripId) {
      axios.get(`http://localhost:5030/api/TravelBudget/trip/${tripId}`)
        .then((res) => {
          const expensesArray = Array.isArray(res.data.$values) ? res.data.$values : res.data;
          setExpenses(Array.isArray(expensesArray) ? expensesArray : []);
        })
        .catch((err) => {
          console.error("GET error: ", err);
        });
    }
  }, [tripId]);

  // ✅ Recalculate total when expenses change
  useEffect(() => {
    const total = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    setTotalBudget(total);
  }, [expenses]);

  return (
    <div className="budget-popup-overlay" onClick={onClose}>
      <div className="budget-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="budget-close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="budget-content-container">
          {/* Left Section */}
          <div className="budget-details">
            <h2>Travel Budget Planner</h2>

            <div className="budget-summary">
              <div className="total-budget">
                <div className="budget-total-amount">
                  <h3>Total Budget</h3>
                  <span className="amount">Rs {totalBudget.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="budget-list">
              <h3>Expense Details</h3>
              <div className="budget-items scrollable-list">
                <div className="budget-item header">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                {expenses.length > 0 ? (
                  expenses.map((item, index) => (
                    <div key={index} className="budget-item">
                      <span className="item-name">{item.description}</span>
                      <span className="item-amount">Rs {parseFloat(item.amount).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-message">No expenses added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="budget-image-container">
            <div className="budget-image">
              <img
                src="https://i.pinimg.com/736x/b2/62/89/b26289e815e7294a7a142dd13d222237.jpg"
                alt="budget"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetShow;
