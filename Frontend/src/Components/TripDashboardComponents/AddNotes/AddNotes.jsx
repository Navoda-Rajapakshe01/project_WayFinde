import React, { useState } from 'react';
import './AddNotes.css';

const AddNotes = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 

  // Function to call backend API
  const createNote = async (title, note) => {
    const response = await fetch('http://localhost:5030/api/DashboardNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
      },
      body: JSON.stringify({
  
        noteTitle: title,
        noteDescription: note,
        tripId: 1,
        // Do not send createdDate or createdTime; backend will auto-fill
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create note');
    }else{
      alert('Successfully added.');
    }

    // If backend returns JSON, parse it. If plain text, use response.text()
    // Change this based on your backend implementation
    return response.json();
  };

  const handleSave = async () => {
    if (!title.trim() || !note.trim()) {
      alert('Please enter both title and note content');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const savedNote = await createNote(title, note);
      onSave(savedNote);
      setTitle('');
      setNote('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setNote('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-notes-overlay">
      <div className="add-notes-modal">
        <div className="add-notes-header">
          <h2>Add New Note</h2>
        </div>

        <div className="add-notes-content">
          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="form-group">
            <label htmlFor="note-title">Title</label>
            <input
              type="text"
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="note-content">Note</label>
            <textarea
              id="note-content"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your note here..."
              rows={6}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="add-notes-footer">
          <button
            className="cancel-button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="save-buttons"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNotes;
