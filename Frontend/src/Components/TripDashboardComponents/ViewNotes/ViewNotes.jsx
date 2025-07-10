import React, { useState, useEffect } from 'react';
import './ViewNotes.css';

const ViewNotes = ({ isOpen, onClose, tripId }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const API_BASE_URL = 'http://localhost:5030/api/DashboardNote';

  useEffect(() => {
    if (isOpen && tripId) {
      setIsLoading(true);
      setError(null);
      fetch(`${API_BASE_URL}/trip/${tripId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch notes');
          return res.json();
        })
        .then((data) => {
          // Map API data to local state shape
          const mappedNotes = data.map(note => ({
            id: note.id,
            title: note.noteTitle || '',
            note: note.noteDescription || '',
            createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
            userId: note.userId || null
          }));
          setNotes(mappedNotes);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching notes:', err);
          setError('Failed to load notes. Please try again.');
          setIsLoading(false);
        });
    } else {
      setIsEditing(false);
      setSelectedNote(null);
      setSearchTerm('');
      setError(null);
    }
  }, [isOpen, tripId]);

  const handleNoteClick = (note) => {
    if (isEditing) {
      if (window.confirm('You have unsaved changes. Discard them?')) {
        setSelectedNote(note);
        setIsEditing(false);
      }
    } else {
      setSelectedNote(note);
    }
  };

  const handleDeleteNote = (noteId) => {
    fetch(`${API_BASE_URL}/${noteId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete note');
        setNotes(notes.filter((note) => note.id !== noteId));
        if (selectedNote && selectedNote.id === noteId) {
          setSelectedNote(null);
          setIsEditing(false);
        }
      })
      .catch((err) => {
        console.error('Error deleting note:', err);
      });
  };

  const handleEditClick = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title || '');
      setEditContent(selectedNote.note || '');
      setIsEditing(true);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleCancelEdit = () => {
    if (window.confirm('Discard unsaved changes?')) {
      setIsEditing(false);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      setError('Please fill in both title and note content');
      setSuccessMessage(null);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Prepare the update payload
      const updatedNote = {
        id: selectedNote.id,
        noteTitle: editTitle.trim(),
        noteDescription: editContent.trim(),
        tripId: parseInt(tripId),
        createdAt: selectedNote.createdAt.toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/${selectedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.status}`);
      }

      // Update UI with the edited content
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id 
          ? {
              ...note,
              title: editTitle.trim(),
              note: editContent.trim(),
              updatedAt: new Date()
            }
          : note
      );
      
      setNotes(updatedNotes);
      setSelectedNote({
        ...selectedNote,
        title: editTitle.trim(),
        note: editContent.trim(),
        updatedAt: new Date()
      });
      setIsEditing(false);
      setSuccessMessage('Note updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update the note. Please try again.');
      setIsEditing(true);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const title = note.title || '';
    const noteContent = note.note || '';
    const search = searchTerm.toLowerCase();
    
    return title.toLowerCase().includes(search) || 
           noteContent.toLowerCase().includes(search);
  });

  const formatDate = (date) => {
    try {
      if (!date) return 'No date';
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="view-notes-overlay">
      <div className="view-notes-modal">
        <div className="view-notes-header">
          <h2>Your Notes</h2>
          <button className="closed-button" onClick={onClose}>×</button>
        </div>
        
        <div className="view-notes-search">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <div className="view-notes-content">
          <div className="notes-list">
            {isLoading ? (
              <div className="loading-message">Loading your notes...</div>
            ) : filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <div 
                  key={note.id} 
                  className={`note-item ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
                  onClick={() => handleNoteClick(note)}
                >
                  <h3>{note.title || 'Untitled'}</h3>
                  <p className="note-preview">
                    {note.note ? 
                      `${note.note.substring(0, 60)}${note.note.length > 60 ? '...' : ''}` : 
                      'No content'
                    }
                  </p>
                  <div className="note-date">
                    {note.createdAt ? formatDate(note.createdAt) : 'No date'}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-message">
                {searchTerm ? 'No notes match your search' : 'error loading'}
              </div>
            )}
          </div>
          
          <div className="note-detail">
            {selectedNote ? (
              isEditing ? (
                <div className="note-edit-form">
                  <div className="form-group">
                    <label htmlFor="edit-title">Title</label>
                    <input
                      id="edit-title"
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-content">Note</label>
                    <textarea
                      id="edit-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={12}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="edit-buttons">
                    <button 
                      className="cancel-edit-button" 
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button 
                      className="save-edit-button" 
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="note-detail-header">
                    <h3>{selectedNote.title || 'Untitled'}</h3>
                    <div className="note-actions">
                      <button 
                        className="edit-note-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick();
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-note-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(selectedNote.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="note-detail-date">
                    Created: {selectedNote.createdAt ? formatDate(selectedNote.createdAt) : 'No date'}
                  </div>
                  <div className="note-detail-content">
                    {selectedNote.note || 'No content'}
                  </div>
                </>
              )
            ) : (
              <div className="select-note-message">
                Select a note to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotes;