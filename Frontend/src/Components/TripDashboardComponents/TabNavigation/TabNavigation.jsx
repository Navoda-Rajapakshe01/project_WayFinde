import React, { useState } from "react";
import "./TabNavigation.css";
import CustomButtons from "../CustomButtons/CustomButtons";
import DashboardSaves from "../DashboardSaves/DashboardSaves";
import AddNotes from "../AddNotes/AddNotes";
import ViewNotes from "../ViewNotes/ViewNotes";
import CalendarView from "../CalendarView/CalendarView";

const TabNavigation = ({
  tripId,
  sharedMode = false,
  selectedDate,
  setSelectedDate,
}) => {
  console.log("TabNavigation received tripId:", tripId); // Debug log
  const [activeTab, setActiveTab] = useState("for-you");
  const [isAddNotesOpen, setIsAddNotesOpen] = useState(false);
  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);

  const handleTabClick = (tab) => {
    if (tab !== "calendar") {
      setSelectedDate(null); // Clear map filter when leaving calendar
    }
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
    console.log("Note saved:", noteData);

    // Close the add notes modal after saving
    setIsAddNotesOpen(false);

    // Optionally, open the view notes modal to see the newly added note
    // setIsViewNotesOpen(true);
  };

  return (
    <div className="tab-navigation-container">
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => handleTabClick("calendar")}
        >
          Calendar
        </button>
        <button
          className={`tab-button ${activeTab === "for-you" ? "active" : ""}`}
          onClick={() => handleTabClick("for-you")}
        >
          For you
        </button>
        <button
          className={`tab-button ${activeTab === "saves" ? "active" : ""}`}
          onClick={() => handleTabClick("saves")}
        >
          Saves
        </button>
        <div className="notes-buttons">
          <button
            className="add-notes-button"
            onClick={handleAddNotes}
            disabled={sharedMode}
          >
            + Add Notes
          </button>
          <button className="view-notes-button" onClick={handleViewNotes}>
            View Notes
          </button>
        </div>
      </div>

      {activeTab === "calendar" && (
        <CalendarView
          tripId={tripId}
          setSelectedDate={setSelectedDate}
          sharedMode={sharedMode}
        />
      )}

      {activeTab === "for-you" && (
        <CustomButtons tripId={tripId} sharedMode={sharedMode} />
      )}
      {activeTab === "saves" && (
        <DashboardSaves tripId={tripId} sharedMode={sharedMode} />
      )}

      <AddNotes
        isOpen={isAddNotesOpen}
        onClose={handleCloseAddNotes}
        onSave={handleSaveNote}
        tripId={tripId}
        sharedMode={sharedMode}
      />

      <ViewNotes
        isOpen={isViewNotesOpen}
        onClose={handleCloseViewNotes}
        tripId={tripId}
        sharedMode={sharedMode}
      />
    </div>
  );
};

export default TabNavigation;
