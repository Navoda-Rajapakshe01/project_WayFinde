import React, { useState, useEffect } from 'react';
import './TodoList.css';
import TodoPopup from '../TodoPopup/TodoPopup';
import axios from 'axios';  // Import Axios for API requests

const TodoList = () => {
  const [notes, setNotes] = useState([]);  // Empty array to store data from backend
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //Fetch data from the backend (GET request)
  useEffect(() => {
    axios.get('http://localhost:5030/api/todo')  // API endpoint
      .then(res => {
        const fetchedTodos = res.data.map(todo => ({
          id: todo.id,
          text: todo.taskName,  // Use taskName from the API response
          completed: todo.taskStatus === 'Completed' // Convert taskStatus to boolean
        }));
        setNotes(fetchedTodos);  // Set the fetched data to state
      })
      .catch(err => console.error("GET error: ", err));  // Log error if any
  }, []);

  //Update task status (PUT request)
  const handleTaskStatusChange = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Completed" : "Active";

    axios.put(`http://localhost:5030/api/todo/ToggleStatus/${id}`, { taskStatus: newStatus })
      .then(res => {
        const updatedTask = res.data;
        setNotes(notes.map(note => 
          note.id === id ? { ...note, completed: newStatus === 'Completed' } : note
        ));
      })
      .catch(err => console.error("PUT error: ", err));  // Log error if any
  };

  // Handle adding a new note
  const handleAddNewNote = (newNoteText) => {
    const newTodo = {
      taskName: newNoteText,  // taskName is sent in the request
      taskStatus: 'Active',   // Default status when creating a new task
      createdAt: new Date(),  // Send current time as createdAt
      updatedAt: new Date()   // Send current time as updatedAt
    };

    axios.post('http://localhost:5030/api/todo', newTodo) // POST request to backend
      .then(res => {
        const added = {
          id: res.data.id,
          text: res.data.taskName,
          completed: res.data.taskStatus === 'Completed' // Convert taskStatus to boolean
        };
        setNotes([...notes, added]);  // Update frontend with new task
        setIsPopupOpen(false);  // Close popup after adding
      })
      .catch(err => console.error("POST error: ", err));  // Log error if any
  };

  // Handle search input change
  const handleSearchChange = (e) => setSearchText(e.target.value);

  // Filter notes based on search text and completion status
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

      <div className="notes-lists">
        {filteredNotes.map(note => (
          <div key={note.id} className="note-items">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={note.completed}
                onChange={() => handleTaskStatusChange(note.id, note.completed ? "Completed" : "Active")}  // Change status on checkbox click
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
