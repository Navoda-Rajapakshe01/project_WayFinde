import React, { useState } from 'react';
import { X, CheckCircle, Circle, Plus } from 'lucide-react';
import './To-DoShow.css';

const ToDoShow = ({ onClose }) => {
  // Sample data - replace with your actual data from backend
  const [todos, setTodos] = useState([
    { id: 1, task: 'Book flight tickets', completed: true },
    { id: 2, task: 'Reserve hotel accommodations', completed: true },
    { id: 3, task: 'Research local attractions', completed: false },
    { id: 4, task: 'Create packing list', completed: false },
    { id: 5, task: 'Exchange currency', completed: false },
    { id: 6, task: 'Buy travel insurance', completed: false },
  ]);
  
  const [newTask, setNewTask] = useState('');
  
  // Add new task
  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTodo = {
        id: todos.length + 1,
        task: newTask,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setNewTask('');
    }
  };
  
  // Toggle task completion status
  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  // Filter todos
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todo-popup-overlay" onClick={onClose}>
      <div className="todo-popup-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="todo-content-container">
          <div className="todo-details">
            <h2>Trip To-Do List</h2>
            
            <div className="add-task-section">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="task-input"
              />
              <button className="add-button" onClick={handleAddTask}>
                <Plus size={20} />
              </button>
            </div>
            
            <div className="todo-lists-container">
              <div className="todo-section">
                <h3>Active Tasks ({activeTodos.length})</h3>
                <div className="todo-list">
                  {activeTodos.map(todo => (
                    <div key={todo.id} className="todo-item">
                      <button 
                        className="todo-checkbox"
                        onClick={() => toggleComplete(todo.id)}
                      >
                        <Circle size={18} />
                      </button>
                      <span className="todo-text">{todo.text || todo.task}</span>
                    </div>
                  ))}
                  {activeTodos.length === 0 && (
                    <p className="empty-message">No active tasks</p>
                  )}
                </div>
              </div>
              
              <div className="todo-section">
                <h3>Completed Tasks ({completedTodos.length})</h3>
                <div className="todo-list completed-list">
                  {completedTodos.map(todo => (
                    <div key={todo.id} className="todo-item completed">
                      <button 
                        className="todo-checkbox checked"
                        onClick={() => toggleComplete(todo.id)}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <span className="todo-text">{todo.text || todo.task}</span>
                    </div>
                  ))}
                  {completedTodos.length === 0 && (
                    <p className="empty-message">No completed tasks</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="todo-image-container">
            <div className="todo-image">
              <img src="https://i.pinimg.com/736x/81/38/dd/8138ddb1e0965010da62a76fd7a2fc8f.jpg" alt="Travel checklist" />
            </div>
            <div className="image-caption">
              <p>Stay organized for your adventure!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoShow;