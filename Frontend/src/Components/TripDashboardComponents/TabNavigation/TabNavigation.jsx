import React, { useState } from 'react';
import './TabNavigation.css';
import CustomButtons from '../CustomButtons/CustomButtons';
import DashboardSaves from '../DashboardSaves/DashboardSaves';
import AddNotes from '../AddNotes/AddNotes';
import ViewNotes from '../ViewNotes/ViewNotes';


const TabNavigation = ({ tripId }) => {
  console.log('TabNavigation received tripId:', tripId);  // Debug log
  const [activeTab, setActiveTab] = useState('for-you');
  const [isAddNotesOpen, setIsAddNotesOpen] = useState(false);
  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);

  const handleTabClick = (tab) => {
    console.log('Tab clicked:', tab);  // Debug log
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

      {activeTab === 'for-you' && <CustomButtons tripId={tripId} />}
      {activeTab === 'saves' && <DashboardSaves tripId={tripId} />}
      
      <AddNotes 
        isOpen={isAddNotesOpen} 
        onClose={handleCloseAddNotes} 
        onSave={handleSaveNote} 
        tripId={tripId}
      />
      
      <ViewNotes
        isOpen={isViewNotesOpen}
        onClose={handleCloseViewNotes}
        tripId={tripId}
      />
    </div>
  );
};

export default TabNavigation;