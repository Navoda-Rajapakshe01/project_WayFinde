import React, { useState, useEffect } from 'react';
import './TodoList.css';
import TodoPopup from '../TodoPopup/TodoPopup';
import axios from 'axios';

const TodoList = () => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ✅ GET from backend
  useEffect(() => {
    axios.get('http://localhost:5030/api/todo')
      .then(res => {
        const fetchedTodos = res.data.map(todo => ({
          id: todo.id,
          text: todo.description,
          completed: todo.isCompleted
        }));
        setNotes(fetchedTodos);
      })
      .catch(err => console.error("GET error: ", err));
  }, []);

  // ✅ POST to backend
  const handleAddNewNote = (newNoteText) => {
    const newTodo = {
      description: newNoteText,
      isCompleted: false
    };

    axios.post('http://localhost:5030/api/todo', newTodo)
      .then(res => {
        const added = {
          id: res.data.id,
          text: res.data.description,
          completed: res.data.isCompleted
        };
        setNotes([...notes, added]); // UI update
        setIsPopupOpen(false); // Close popup
      })
      .catch(err => console.error("POST error: ", err));
  };

  const toggleComplete = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const handleSearchChange = (e) => setSearchText(e.target.value);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.text.toLowerCase().includes(searchText.toLowerCase());
    if (filter === 'ALL') return matchesSearch;
    if (filter === 'COMPLETED') return matchesSearch && note.completed;
    if (filter === 'ACTIVE') return matchesSearch && !note.completed;
    return matchesSearch;
  });

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

      {isPopupOpen && (
        <TodoPopup 
          onClose={() => setIsPopupOpen(false)} 
          onSave={handleAddNewNote}
        />
      )}
    </div>
  );
};

export default TodoList;
