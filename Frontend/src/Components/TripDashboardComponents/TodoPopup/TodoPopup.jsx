import React, { useState } from 'react';
import './TodoPopup.css';

const TodoPopup = ({ onClose, onSave }) => {
  const [newNoteText, setNewNoteText] = useState('');

  const handleSave = () => {
    if (newNoteText.trim()) {
      onSave(newNoteText);
      setNewNoteText(''); 
      onClose(); 
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h5>Add New Task</h5>
        <input
          type="text"
          placeholder="Enter task..."
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          className="popup-input"
        />
        <div className="popup-buttons">
          <button onClick={onClose} className="popup-button closes-button">
            Cancel
          </button>
          <button onClick={handleSave} className="popup-button saves-button">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoPopup;
