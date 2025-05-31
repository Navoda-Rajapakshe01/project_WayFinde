import React, { useState } from 'react';
import './SavesComment.css';

function SavesComment() {
  const [commentText, setCommentText] = useState('');
  const [comment, setComment] = useState(null);
  const [showInputBox, setShowInputBox] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Save a new comment
  const saveComment = () => {
    if (!commentText.trim()) return; // Don't add empty comments
    
    const newComment = { id: Date.now(), text: commentText };
    setComment(newComment);
    setCommentText('');
    setShowInputBox(false);
    setIsEditing(false);
  };

  // Handle key press to save comment when Enter is pressed
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveComment();
    }
  };

  // Edit existing comment
  const editComment = () => {
    if (comment) {
      setCommentText(comment.text);
      setIsEditing(true);
      setShowOptions(false);
    }
  };

  // Delete comment
  const deleteComment = () => {
    setComment(null);
    setShowOptions(false);
    setShowInputBox(true);
    setIsEditing(false);
  };

  // Toggle options menu
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // Click outside to close dropdown
  const handleClickOutside = () => {
    setShowOptions(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <div className="comment-container">
      {/* Comment Display or Edit Form */}
      {comment && !isEditing ? (
        <div className="comment-display">
          <div className="comment-item">
            <p className="comment-text">{comment.text}</p>
            
            {/* Three dots menu button */}
            <button 
              onClick={toggleOptions}
              className="options-button"
            >
              ⋮
            </button>
            
            {/* Options dropdown */}
            {showOptions && (
              <div className="options-dropdown">
                <button 
                  onClick={editComment}
                  className="option-item edit-option"
                >
                  Edit
                </button>
                <button 
                  onClick={deleteComment}
                  className="option-item delete-option"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ) : comment && isEditing ? (
        <div className="edit-comment-form">
          <div className="input-with-arrow">
            <input
              type="text"
              placeholder="Edit your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
          <div className="edit-actions">
            <button onClick={saveComment} className="saves-button">Save</button>
            <button onClick={cancelEditing} className="cancel-button">Cancel</button>
          </div>
        </div>
      ) : null}
      
      {/* Add New Comment Input Box */}
      {!comment && showInputBox ? (
        <div className="input-with-arrow">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
        </div>
      ) : !comment && !showInputBox ? (
        <button 
          onClick={() => setShowInputBox(true)}
          className="add-comment-button"
        >
          Add a comment
        </button>
      ) : null}
      
      {/* Click outside to close dropdown */}
      {showOptions && (
        <div 
          className="overlay"
          onClick={handleClickOutside}
        ></div>
      )}
    </div>
  );
}

export default SavesComment;
