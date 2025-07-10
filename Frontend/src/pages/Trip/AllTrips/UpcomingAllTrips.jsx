import React, { useState, useEffect } from "react";
import "./UpcomingAllTrips.css";

const UpcomingAllTrips = () => {
  const [tripStats, setTripStats] = useState({
    completedTrips: 16,
    upcomingTrips: 4,
    placesVisited: 567,
    travelDistance: "2485 km",
    nextTripDate: "15/02/2024",
  });

  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      id: 1,
      name: "Winter Vibes",
      startDate: "16/02/2025",
      places: 12,
      avgSpent: "LKR 890,000",
      startLocation: "Shangri-La, Colombo",
      totalDistance: "323 km",
      destinations: [
        {
          name: "Shangri La Hotel Colombo",
          stay: "24 hrs",
          date: "15/02/2025",
        },
        { name: "Kandy View Hotel", stay: "48 hrs", date: "16/02/2025" },
      ],
    },
    {
      id: 2,
      name: "Summer Escape",
      startDate: "20/03/2025",
      places: 8,
      avgSpent: "LKR 720,000",
      startLocation: "Galle Fort, Galle",
      totalDistance: "280 km",
      destinations: [
        { name: "Jetwing Yala", stay: "24 hrs", date: "20/03/2025" },
        { name: "The Grand Kandyan", stay: "48 hrs", date: "22/03/2025" },
      ],
    },
  ]);

  const [completedTrips, setCompletedTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(upcomingTrips[0] || null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showPopup, setShowPopup] = useState(null);
  const [collaborators, setCollaborators] = useState([]);

  const toggleMenu = (tripId) => {
    setMenuOpen(menuOpen === tripId ? null : tripId);
  };

  const handleOutsideClick = (event) => {
    if (
      !event.target.closest(".menu-dropdown") &&
      !event.target.closest(".menu-icon")
    ) {
      setMenuOpen(null);
    }
  };

  const deleteTrip = (tripId) => {
    setUpcomingTrips(upcomingTrips.filter((trip) => trip.id !== tripId));
  };

  const markAsCompleted = (tripId) => {
    const tripToMove = upcomingTrips.find((trip) => trip.id === tripId);
    if (tripToMove) {
      setCompletedTrips([...completedTrips, tripToMove]);
      setUpcomingTrips(upcomingTrips.filter((trip) => trip.id !== tripId));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="upcoming-trips-container">
      <div className="trip-stats">
        <div className="stat-box">
          Completed Trips: {tripStats.completedTrips}
        </div>
        <div className="stat-box">
          Upcoming Trips: {tripStats.upcomingTrips}
        </div>
        <div className="stat-box">
          Places Visited: {tripStats.placesVisited}
        </div>
        <div className="stat-box">
          Travel Distance: {tripStats.travelDistance}
        </div>
        <div className="stat-box">Next Trip Date: {tripStats.nextTripDate}</div>
      </div>

      <div className="trips-content">
        <div className="trip-list-container">
          <div className="trip-tabs">
            <button
              className={activeTab === "upcoming" ? "active" : ""}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Trips
            </button>
            <button
              className={activeTab === "completed" ? "active" : ""}
              onClick={() => setActiveTab("completed")}
            >
              Completed Trips
            </button>
          </div>
          <div className="trip-list">
            {(activeTab === "upcoming" ? upcomingTrips : completedTrips).map(
              (trip) => (
                <div
                  key={trip.id}
                  className={`trip-card ${
                    selectedTrip?.id === trip.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedTrip(trip)}
                >
                  <h3>{trip.name}</h3>
                  <p>Start Date: {trip.startDate}</p>
                  <p>Avg. Spent: {trip.avgSpent}</p>
                  <p>Start Location: {trip.startLocation}</p>
                  <p>Total Distance: {trip.totalDistance}</p>
                  <div
                    className="menu-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(trip.id);
                    }}
                  >
                    ...
                  </div>
                  {menuOpen === trip.id && (
                    <div className="menu-dropdown show">
                      <div
                        className="menu-option"
                        onClick={() => setShowPopup("invite")}
                      >
                        Invite
                      </div>
                      <div
                        className="menu-option"
                        onClick={() => setShowPopup("share")}
                      >
                        Share Trip
                      </div>
                      {activeTab === "upcoming" && (
                        <div
                          className="menu-option"
                          onClick={() => markAsCompleted(trip.id)}
                        >
                          Mark as Completed
                        </div>
                      )}
                      <div
                        className="menu-option delete"
                        onClick={() => deleteTrip(trip.id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card selection when clicking "View"
                      console.log(`Viewing trip: ${trip.name}`);
                    }}
                  >
                    View
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/*  Right Side - Show trip details when a card is clicked */}
        <div className="trip-details">
          {selectedTrip ? (
            <>
              <h2>{selectedTrip.name}</h2>
              <ul>
                {selectedTrip.destinations.map((dest, index) => (
                  <li key={index}>
                    {dest.name} - {dest.stay} | {dest.date}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No trip selected</p>
          )}
        </div>
      </div>

      {/*  Popup Section */}
      {showPopup === "invite" && (
        <div className="popup-overlay-3" onClick={() => setShowPopup(null)}>
          <div
            className="popup-container-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(null)}
              className="popup-close-3"
            >
              &times;
            </button>
            <h2 className="popup-title">Trip Collaboration</h2>
            <p>Copy and send the link below to invite collaborators.</p>
            <div className="copy-container">
              <input
                type="text"
                value="Generated_Link"
                readOnly
                className="copy-input"
              />
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText("Generated_Link")}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup === "share" && (
        <div className="popup-overlay-3" onClick={() => setShowPopup(null)}>
          <div
            className="popup-container-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(null)}
              className="popup-close-3"
            >
              &times;
            </button>
            <h2 className="popup-title">Share Your Trip</h2>
            <p>Copy and send the link below to share your trip.</p>
            <div className="copy-container">
              <input
                type="text"
                value="Generated_Link"
                readOnly
                className="copy-input"
              />
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText("Generated_Link")}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAllTrips;
