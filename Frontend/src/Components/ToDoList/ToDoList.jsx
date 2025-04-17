import React, { useState } from 'react';
import './TodoList.css';
import TodoPopup from '../TodoPopup/TodoPopup';

const TodoList = () => {
  const [notes, setNotes] = useState([

 
  ]);

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Add state for the popup

  const toggleComplete = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.text.toLowerCase().includes(searchText.toLowerCase());
    if (filter === 'ALL') return matchesSearch;
    if (filter === 'COMPLETED') return matchesSearch && note.completed;
    if (filter === 'ACTIVE') return matchesSearch && !note.completed;
    return matchesSearch;
  });

  // Add this function to handle new note addition
  const handleAddNewNote = (newNoteText) => {
    const newId = Math.max(...notes.map(note => note.id), 0) + 1;
    setNotes([...notes, { id: newId, text: newNoteText, completed: false }]);
    setIsPopupOpen(false); // Close the popup after adding a new note
  };

  return (
    <div className="todo-list-container">
      <h2 className="todo-title">TODO LIST</h2>
      
      <div className="search-filter-container">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search note..." 
            value={searchText}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="search-button">
            <span className="search-icon">🔍</span>
          </button>
        </div>
        
        <div className="filter-dropdown">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">ALL</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ACTIVE">ACTIVE</option>
          </select>
        </div>
      </div>
      
      <div className="notes-list">
        {filteredNotes.map(note => (
          <div key={note.id} className="note-item">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={note.completed} 
                onChange={() => toggleComplete(note.id)}
              />
              <span className="custom-checkbox"></span>
              <span className={`note-text ${note.completed ? 'completed' : ''}`}>
                {note.text}
              </span>
            </label>
          </div>
        ))}
     </div>
      
      <button className="add-note-button" onClick={() => setIsPopupOpen(true)}>
        <span className="plus-icon">+</span>
      </button>

      {/* Popup for adding a new note */}
      {isPopupOpen && (
        <TodoPopup 
          onClose={() => setIsPopupOpen(false)} 
          onSave={handleAddNewNote} // Pass the handler for adding a new note
        />
      )}
    </div>
  );
};

export default TodoList;
