import React, { useState, useEffect } from "react";
import "./TodoList.css";
import TodoPopup from "../TodoPopup/TodoPopup";
import axios from "axios"; // Import Axios for API requests

const TodoList = ({ tripId, sharedMode = false }) => {
  console.log("TodoList received tripId:", tripId); // Debug log
  const [notes, setNotes] = useState([]); // Empty array to store data from backend
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //Fetch data from the backend (GET request)
  useEffect(() => {
    console.log("Fetching todos for tripId:", tripId); // Debug log
    if (tripId) {
      axios
        .get("http://localhost:5030/api/Todo") // Fetch all todos
        .then((res) => {
          console.log("Received todos:", res.data);
          const todosArray = Array.isArray(res.data.$values) ? res.data.$values : res.data;
          if (!Array.isArray(todosArray)) {
            setNotes([]);
            return;
          }
          const fetchedTodos = todosArray
            .filter((todo) => todo.tripId === Number(tripId))
            .map((todo) => ({
              id: todo.id,
              text: todo.taskName,
              completed: todo.taskStatus === "Completed",
            }));
          setNotes(fetchedTodos);
        })
        .catch((err) => console.error("GET error: ", err));
    }
  }, [tripId]);

  //Update task status (PUT request)
  const handleTaskStatusChange = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Completed" : "Active";

    axios
      .put(`http://localhost:5030/api/Todo/ToggleStatus/${id}`, {
        taskStatus: newStatus,
        tripId: parseInt(tripId), // Include tripId in the update
      })
      .then((res) => {
        const updatedTask = res.data;
        setNotes(
          notes.map((note) =>
            note.id === id
              ? { ...note, completed: newStatus === "Completed" }
              : note
          )
        );
      })
      .catch((err) => console.error("PUT error: ", err));
  };

  // Handle adding a new note
  const handleAddNewNote = (newNoteText) => {
    console.log("Adding new todo with tripId:", tripId); // Debug log to check tripId
    const newTodo = {
      taskName: newNoteText,
      taskStatus: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
      tripId: Number(tripId),
    };
    console.log("New todo object:", newTodo);

    axios
      .post("http://localhost:5030/api/Todo", newTodo)
      .then((res) => {
        console.log("Todo added successfully:", res.data);
        alert("Todo added successfully");
        const added = {
          id: res.data.id,
          text: res.data.taskName,
          completed: res.data.taskStatus === "Completed",
        };
        setNotes([...notes, added]);
        setIsPopupOpen(false);
      })
      .catch((err) => {
        console.error("POST error: ", err);
        console.error("Error details:", err.response?.data);
      });
  };

  // Handle search input change
  const handleSearchChange = (e) => setSearchText(e.target.value);

  // Filter notes based on search text and completion status
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.text
      .toLowerCase()
      .includes(searchText.toLowerCase());
    if (filter === "ALL") return matchesSearch;
    if (filter === "COMPLETED") return matchesSearch && note.completed;
    if (filter === "ACTIVE") return matchesSearch && !note.completed;
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
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-items">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={note.completed}
                disabled={sharedMode}
                onChange={() =>
                  !sharedMode &&
                  handleTaskStatusChange(
                    note.id,
                    note.completed ? "Completed" : "Active"
                  )
                }
              />

              <span className="custom-checkbox"></span>
              <span
                className={`note-text ${note.completed ? "completed" : ""}`}
              >
                {note.text}
              </span>
            </label>
          </div>
        ))}
      </div>

      {!sharedMode && (
        <button
          className="add-note-button"
          onClick={() => setIsPopupOpen(true)}
        >
          <span className="plus-icon">+</span>
        </button>
      )}

      {isPopupOpen && (
        <TodoPopup
          onClose={() => setIsPopupOpen(false)}
          onSave={handleAddNewNote}
          sharedMode={sharedMode}
        />
      )}
    </div>
  );
};

export default TodoList;
