import React, { useState } from 'react';
import './TabNavigation.css';
import CustomButtons from '../CustomButtons/CustomButtons';
import DashboardSaves from '../DashboardSaves/DashboardSaves';
import AddNotes from '../AddNotes/AddNotes';
import ViewNotes from '../ViewNotes/ViewNotes';

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState('for-you');
  const [isAddNotesOpen, setIsAddNotesOpen] = useState(false);
  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddNotes = () => {
    setIsAddNotesOpen(true);
  };

  const handleCloseAddNotes = () => {
    setIsAddNotesOpen(false);
  };

  const handleViewNotes = () => {
    setIsViewNotesOpen(true);
  };

  const handleCloseViewNotes = () => {
    setIsViewNotesOpen(false);
  };

  const handleSaveNote = (noteData) => {
    // Here you would typically save the note to your backend
    // Example API call:
    // 
    // fetch('your-api-endpoint/notes', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(noteData),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Note saved successfully:', data);
    //   // Potentially update state or perform other actions on success
    // })
    // .catch(error => {
    //   console.error('Error saving note:', error);
    // });

    console.log('Note saved:', noteData);
    
    // Close the add notes modal after saving
    setIsAddNotesOpen(false);
    
    // Optionally, open the view notes modal to see the newly added note
    // setIsViewNotesOpen(true);
  };

  return (
    <div className="tab-navigation-container">
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => handleTabClick('calendar')}
        >
          Calendar
        </button>
        <button
          className={`tab-button ${activeTab === 'for-you' ? 'active' : ''}`}
          onClick={() => handleTabClick('for-you')}
        >
          For you
        </button>
        <button
          className={`tab-button ${activeTab === 'saves' ? 'active' : ''}`}
          onClick={() => handleTabClick('saves')}
        >
          Saves
        </button>
        <div className="notes-buttons">
          <button
            className="add-notes-button"
            onClick={handleAddNotes}
          >
            + Add Notes
          </button>
          <button
            className="view-notes-button"
            onClick={handleViewNotes}
          >
            View Notes
          </button>
        </div>
      </div>

      {activeTab === 'for-you' && <CustomButtons />}
      {activeTab === 'saves' && <DashboardSaves />}
      
      <AddNotes 
        isOpen={isAddNotesOpen} 
        onClose={handleCloseAddNotes} 
        onSave={handleSaveNote} 
      />
      
      <ViewNotes
        isOpen={isViewNotesOpen}
        onClose={handleCloseViewNotes}
      />
    </div>
  );
};

export default TabNavigation;