import React from "react";
import { useState, useEffect } from "react";
import "./AllTrips.css";
import ShareTripModal from "./Components/Modals/ShareTripModal";
import InviteCollaboratorsModal from "./Components/Modals/InviteCollaboratorsModal";
import DeleteTripModal from "./Components/Modals/DeleteTripModal";
import SetTripDatesModal from "./Components/Modals/SetTripDatesModal";
import NotificationPanel from "./Components/Notifications/NotificationPanel";
import { calculateTripStats } from "./utils/tripStats";
import {
  Bell,
  Users,
  Share2,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  MapPin,
  Eye,
  Map,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllTrips = () => {
  const [tripStats, setTripStats] = useState({});
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showPopup, setShowPopup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [existingCollaborators, setExistingCollaborators] = useState([]);
  const navigate = useNavigate();
  const [confirmDeleteTrip, setConfirmDeleteTrip] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const [collaborativeTrips, setCollaborativeTrips] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [pendingTripInvites, setPendingTripInvites] = useState([]);
  const [showSetDatesPopup, setShowSetDatesPopup] = useState(false);
  const [tripPlaceDates, setTripPlaceDates] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const refreshCollaborativeTrips = async () => {
    try {
      const res = await fetch(
        `http://localhost:5030/api/trips/collaborative?userId=${currentUserId}`
      );
      const data = await res.json();
      const mappedCollaborative = data.map((trip) => {
        const { totalSpent, totalDistance } = calculateTripStats(
          trip.places || []
        );
        return {
          ...trip,
          name: trip.tripName,
          avgSpent: `LKR ${trip.avgSpend?.toLocaleString() ?? "0"}`,
          startLocation: trip.places?.[0]?.name || "N/A",
          totalDistance: `${totalDistance} km`,
          destinations:
            trip.places?.map((place) => ({
              name: place.name || "N/A",
              stay: place.avgTime || "24 hrs",
              date: place.startDate
                ? new Date(place.startDate).toLocaleDateString()
                : new Date(trip.startDate).toLocaleDateString(),
            })) || [],
          thumbnail: trip.thumbnail || "https://via.placeholder.com/120",
        };
      });
      setCollaborativeTrips(mappedCollaborative);
    } catch (err) {
      console.error("Error fetching collaborative trips:", err);
    }
  };

  const refreshPendingInvites = () => {
    fetch(`http://localhost:5030/api/trips/invitations?userId=${currentUserId}`)
      .then((res) => res.json())
      .then(setPendingInvites);
  };

  useEffect(() => {
    if (showPopup === "invite" && selectedTrip) {
      fetch(
        `http://localhost:5030/api/trips/get-collaborators?tripId=${selectedTrip.id}`
      )
        .then((res) => res.json())
        .then(setExistingCollaborators)
        .catch(console.error);
      fetch(
        `http://localhost:5030/api/trips/get-pending-invites?tripId=${selectedTrip.id}`
      )
        .then((res) => res.json())
        .then(setPendingTripInvites)
        .catch(console.error);
    }
  }, [showPopup, selectedTrip]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetch(`http://localhost:5030/api/trips/search-users?query=${searchQuery}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data));
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchTripPreviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:5030/api/trips/user-preview/${currentUserId}`
      );
      const data = await res.json();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = data.filter((trip) => {
        const tripStart = new Date(trip.startDate);
        tripStart.setHours(0, 0, 0, 0);
        return tripStart >= today;
      });

      const completed = data.filter((trip) => {
        const tripEnd = new Date(trip.endDate);
        tripEnd.setHours(0, 0, 0, 0);
        return tripEnd < today;
      });

      setUpcomingTrips(upcoming);
      setCompletedTrips(completed);

      const totalTrips = data.length;
      const placesVisited = data
        .filter((trip) => new Date(trip.endDate) < new Date())
        .reduce((sum, trip) => sum + (trip.places?.length || 0), 0);

      const nextTrip = upcoming.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      )[0];

      setTripStats({
        completedTrips: completed.length,
        upcomingTrips: upcoming.length,
        placesVisited,
        nextTripDate: nextTrip?.startDate?.slice(0, 10) || "N/A",
      });

      const allTripsWithPreview = data.map((trip) => {
        const { totalSpent, totalDistance } = calculateTripStats(
          trip.places || []
        );
        return {
          ...trip,
          name: trip.tripName,
          avgSpent: `LKR ${trip.avgSpend?.toLocaleString() ?? "0"}`,
          startLocation: trip.places?.[0]?.name || "N/A",
          userId: trip.userId,
          totalDistance: `${totalDistance} km`,
          destinations:
            trip.places?.map((place) => ({
              name: place.name || "N/A",
              stay: place.avgTime || "24 hrs",
              date: place.startDate
                ? new Date(place.startDate).toLocaleDateString()
                : new Date(trip.startDate).toLocaleDateString(),
            })) || [],
          thumbnail: trip.thumbnail || "https://via.placeholder.com/120",
          places: trip.places || [],
        };
      });

      setUpcomingTrips(
        allTripsWithPreview.filter((trip) => {
          const tripStart = new Date(trip.startDate);
          const today = new Date();
          tripStart.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          return tripStart >= today;
        })
      );

      setCompletedTrips(
        allTripsWithPreview.filter((trip) => {
          const tripEnd = new Date(trip.endDate);
          const today = new Date();
          tripEnd.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          return tripEnd < today;
        })
      );

      setSelectedTrip(allTripsWithPreview[0] || null);
    } catch (err) {
      console.error("Error fetching trip previews:", err);
    }
  };

  useEffect(() => {
    fetchTripPreviews();
  }, []);

  useEffect(() => {
    if (activeTab !== "collaborative") return;
    fetch(
      `http://localhost:5030/api/trips/collaborative?userId=${currentUserId}`
    )
      .then((res) => res.json())
      .then((data) => {
        const mappedCollaborative = data.map((trip) => {
          const { totalSpent, totalDistance } = calculateTripStats(
            trip.places || []
          );
          return {
            ...trip,
            name: trip.tripName,
            avgSpent: `LKR ${trip.avgSpend?.toLocaleString() ?? "0"}`,
            startLocation: trip.places?.[0]?.name || "N/A",
            userId: trip.userId,
            totalDistance: `${totalDistance} km`,
            destinations:
              trip.places?.map((place) => ({
                name: place.name || "N/A",
                stay: place.avgTime || "24 hrs",
                date: place.startDate
                  ? new Date(place.startDate).toLocaleDateString()
                  : new Date(trip.startDate).toLocaleDateString(),
              })) || [],
            thumbnail: trip.thumbnail || "https://via.placeholder.com/120",
          };
        });
        setCollaborativeTrips(mappedCollaborative);
        setSelectedTrip(mappedCollaborative[0] || null);
      })
      .catch((error) => {
        console.error("Failed to fetch collaborative trips:", error);
      });
  }, [activeTab, currentUserId]);

  useEffect(() => {
    if (selectedTrip && showPopup === "invite") {
      console.log("selectedTrip.userId:", selectedTrip.userId);
      existingCollaborators.forEach((u) =>
        console.log("collaborator id:", u.id)
      );
    }
  }, [selectedTrip, existingCollaborators, showPopup]);

  useEffect(() => {
    fetch(`http://localhost:5030/api/trips/invitations?userId=${currentUserId}`)
      .then((res) => res.json())
      .then(setPendingInvites);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const panel = document.querySelector(".notification-panel");
      const bell = document.querySelector(".notification-bell");
      if (
        panel &&
        !panel.contains(event.target) &&
        bell &&
        !bell.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const respondToInvite = async (tripId, accept) => {
    await fetch(
      `http://localhost:5030/api/trips/respond-invitation?tripId=${tripId}&userId=${currentUserId}&accept=${accept}`,
      { method: "POST" }
    );
    refreshCollaborativeTrips();
    refreshPendingInvites();
  };

  const toggleMenu = (tripId) => {
    setMenuOpen(menuOpen === tripId ? null : tripId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".menu-dropdown.show");
      const icons = document.querySelectorAll(".menu-icon");
      const clickedInsideMenu = Array.from(dropdowns).some((menu) =>
        menu.contains(event.target)
      );
      const clickedMenuIcon = Array.from(icons).some((icon) =>
        icon.contains(event.target)
      );
      if (!clickedInsideMenu && !clickedMenuIcon) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const deleteTrip = (tripId) => {
    setUpcomingTrips(upcomingTrips.filter((trip) => trip.id !== tripId));
  };

  const getCurrentTrips = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingTrips;
      case "completed":
        return completedTrips;
      case "collaborative":
        return collaborativeTrips;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {tripStats.completedTrips || 0}
          </div>
          <div className="text-gray-600 text-sm font-medium">
            Completed Trips
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {tripStats.upcomingTrips || 0}
          </div>
          <div className="text-gray-600 text-sm font-medium">
            Upcoming Trips
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {tripStats.placesVisited || 0}
          </div>
          <div className="text-gray-600 text-sm font-medium">
            Places Visited
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {tripStats.nextTripDate}
          </div>
          <div className="text-gray-600 text-sm font-medium">
            Next Trip Date
          </div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex justify-between items-center mb-6">
        {/* Tabs */}
        <div className="flex space-x-2">
          <button
            className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
              activeTab === "upcoming"
                ? "bg-[#4CC9FE] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Trips
          </button>
          <button
            className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-[#4CC9FE] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Trips
          </button>
          <button
            className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
              activeTab === "collaborative"
                ? "bg-[#4CC9FE] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            onClick={() => setActiveTab("collaborative")}
          >
            Collaborative Trips
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="relative p-3 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} className="text-gray-600" />
            {pendingInvites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {pendingInvites.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <NotificationPanel
              pendingInvites={pendingInvites}
              onClose={() => setShowNotifications(false)}
              onRespondToInvite={respondToInvite}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trip List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto p-4 space-y-4">
              {getCurrentTrips().map((trip) => (
                <div
                  key={trip.id}
                  className={`wayfind-trip-card-container relative bg-white rounded-2xl border border-transparent transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 overflow-hidden shadow-glow ${
                    selectedTrip?.id === trip.id
                      ? "border-[#4CC9FE] shadow-xl ring-4 ring-[#4CC9FE]/20"
                      : "border-gray-200 hover:border-[#4CC9FE]/50"
                  }`}
                  onClick={() => setSelectedTrip(trip)}
                >
                  {/* Horizontal Layout */}
                  <div className="flex min-h-[14rem] lg:min-h-[16rem]">
                    {/* Left Side - Image */}
                    <div className="relative w-60 flex-shrink-0 min-h-full">
                      <img
                        src={trip.thumbnail || "/placeholder.svg"}
                        alt="Trip"
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-l-2xl"
                      />

                      {/* Time Badge */}
                      <div className="absolute bottom-4 left-4 z-10">
                        <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800 shadow">
                          {(() => {
                            const startDate = new Date(trip.startDate);
                            const today = new Date();
                            const diffTime = startDate - today;
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );

                            if (activeTab === "completed") {
                              return "Completed";
                            } else if (diffDays === 0) {
                              return "Today";
                            } else if (diffDays === 1) {
                              return "In 1 day";
                            } else if (diffDays > 1) {
                              return `In ${diffDays} days`;
                            } else {
                              return "Past due";
                            }
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between relative">
                      {/* 3-Dot Menu */}
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 relative z-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(trip.id);
                          }}
                        >
                          <MoreHorizontal size={18} className="text-gray-600" />
                        </button>

                        {menuOpen === trip.id && (
                          <>
                            {/* Backdrop to close menu */}
                            <div
                              className="fixed inset-0 z-[9998]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(null);
                              }}
                            />
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[9999]">
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTrip(trip);
                                  setShowPopup("invite");
                                  setMenuOpen(null);
                                }}
                              >
                                <Users size={16} />
                                Collaborators
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTrip(trip);
                                  setShowPopup("share");
                                  setMenuOpen(null);
                                }}
                              >
                                <Share2 size={16} />
                                Share Trip
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTrip(trip);
                                  setConfirmDeleteTrip(trip.id);
                                  setMenuOpen(null);
                                }}
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Top Content */}
                      <div className="pr-12">
                        {/* Trip Title */}
                        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2 truncate">
                          {trip.name}
                        </h3>

                        {/* Date and Location Info */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Calendar size={18} className="text-gray-500" />
                            <span className="text-sm text-gray-500 font-medium">
                              {new Date(trip.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-gray-600">
                            <MapPin size={18} className="text-gray-500" />
                            <span className="text-base font-medium truncate">
                              {trip.startLocation}
                              {trip.destinations &&
                                trip.destinations.length > 1 &&
                                `, & ${trip.destinations.length - 1} more`}
                            </span>
                          </div>
                        </div>

                        {/* Avg Spent */}
                        <div className="flex items-center gap-2 mb-4">
                          <DollarSign size={18} className="text-[#4CC9FE]" />
                          <span className="text-base font-bold text-gray-800">
                            {trip.avgSpent}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Section - Buttons and Places Count INSIDE CARD */}
                      <div className="flex items-center justify-between pr-12 mt-4">
                        {/* Action Buttons - INSIDE Each Card */}
                        <div className="flex gap-2">
                          {activeTab !== "completed" && (
                            <button
                              className="px-4 py-2 rounded-full text-sm border border-[#4CC9FE] text-[#4CC9FE] hover:bg-[#4CC9FE] hover:text-white transition-all duration-200 shadow flex items-center gap-2 force-rounded-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const placesWithDates =
                                  trip.places?.map((place) => ({
                                    placeId: place.id,
                                    placeName: place.name,
                                    startDate: place.startDate || "",
                                    endDate: place.endDate || "",
                                  })) || [];
                                setTripPlaceDates(placesWithDates);
                                setSelectedTrip(trip);
                                setShowSetDatesPopup(true);
                              }}
                            >
                              <Calendar size={12} />
                              {trip.places?.some(
                                (p) => p.startDate && p.endDate
                              )
                                ? "Update Dates"
                                : "Set Dates"}
                            </button>
                          )}
                          <button
                            className="px-4 py-2 rounded-full text-sm border border-[#4CC9FE] text-[#4CC9FE] hover:bg-[#4CC9FE] hover:text-white transition-all duration-200 shadow flex items-center gap-2 force-rounded-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/tripdashboard/${trip.id}`);
                            }}
                          >
                            <Eye size={12} />
                            View
                          </button>
                        </div>

                        {/* Places Count - Bottom Right with Blue Color */}
                        <div className="bg-[#4CC9FE]/10 px-2 py-1 rounded-md">
                          <span className="text-xs font-medium text-[#4CC9FE]">
                            {trip.destinations?.length || 0} places
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {getCurrentTrips().length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Map size={24} className="text-gray-400" />
                  </div>
                  <div className="text-gray-400 text-lg font-semibold mb-2">
                    No trips found
                  </div>
                  <div className="text-gray-500 text-sm max-w-md mx-auto">
                    {activeTab === "upcoming" &&
                      "Ready for your next adventure! Start planning your upcoming trips!"}
                    {activeTab === "completed" &&
                      "Your travel memories will appear here once you complete some trips."}
                    {activeTab === "collaborative" &&
                      "Team up with friends and family to plan amazing trips together!"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            {selectedTrip ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {selectedTrip.name}
                </h2>
                <div className="space-y-3">
                  {selectedTrip.destinations?.map((dest, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-6 h-6 bg-[#4CC9FE] text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {dest.name}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedTrip.destinations?.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-sm">
                      No destinations added yet
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  No trip selected
                </div>
                <div className="text-gray-500 text-sm">
                  Select a trip to view its details
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modals */}
      {showPopup === "invite" && selectedTrip && (
        <InviteCollaboratorsModal
          selectedTrip={selectedTrip}
          currentUserId={currentUserId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          existingCollaborators={existingCollaborators}
          pendingTripInvites={pendingTripInvites}
          setShowPopup={setShowPopup}
          setSuccessMessage={setSuccessMessage}
          setSearchResults={setSearchResults}
          refreshCollaborators={async () => {
            const res = await fetch(
              `http://localhost:5030/api/trips/get-collaborators?tripId=${selectedTrip.id}`
            );
            const data = await res.json();
            setExistingCollaborators(data);
          }}
        />
      )}

      {confirmDeleteTrip && (
        <DeleteTripModal
          tripId={confirmDeleteTrip}
          onClose={() => setConfirmDeleteTrip(null)}
          onDeleteConfirm={async () => {
            try {
              const res = await fetch(
                `http://localhost:5030/api/trips/${confirmDeleteTrip}`,
                { method: "DELETE" }
              );
              if (res.ok) {
                await fetchTripPreviews();
                await refreshCollaborativeTrips();
                setConfirmDeleteTrip(null);
                setSuccessMessage("Trip deleted successfully.");
                setTimeout(() => setSuccessMessage(""), 3000);
              } else {
                alert("Failed to delete trip.");
              }
            } catch (err) {
              console.error("Error deleting trip:", err);
              alert("An error occurred.");
            }
          }}
        />
      )}

      {showSetDatesPopup && (
        <SetTripDatesModal
          trip={selectedTrip}
          tripPlaceDates={tripPlaceDates}
          setTripPlaceDates={setTripPlaceDates}
          onClose={() => setShowSetDatesPopup(false)}
          onSave={async () => {
            const payload = tripPlaceDates.map((item) => ({
              tripId: selectedTrip.id,
              placeId: item.placeId,
              startDate: item.startDate,
              endDate: item.endDate,
            }));
            try {
              const res = await fetch(
                "http://localhost:5030/api/trips/save-trip-dates",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );
              if (res.ok) {
                await fetchTripPreviews();
                setTimeout(() => {
                  const allTrips = [...upcomingTrips, ...collaborativeTrips];
                  const updated = allTrips.find(
                    (t) => t.id === selectedTrip.id
                  );
                  if (updated) {
                    setSelectedTrip(updated);
                  }
                }, 100);
                const updatedTrip = {
                  ...selectedTrip,
                  places: tripPlaceDates.map((item) => ({
                    id: item.placeId,
                    name: item.placeName,
                    startDate: item.startDate,
                    endDate: item.endDate,
                  })),
                };
                setSelectedTrip(updatedTrip);
                setSuccessMessage("Trip dates saved successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                setShowSetDatesPopup(false);
              } else {
                alert("Failed to save trip dates.");
              }
            } catch (error) {
              console.error("Error saving trip dates:", error);
              alert("An error occurred while saving trip dates.");
            }
          }}
        />
      )}

      {successMessage && (
        <div
          className="alltrip-success-message"
          onClick={() => setSuccessMessage("")}
        >
          <div className="alltrip-success-content">
            <span className="alltrip-success-icon">✓</span>
            <h3>{successMessage}</h3>
          </div>
        </div>
      )}
      {showPopup === "share" && selectedTrip && (
        <ShareTripModal
          tripId={selectedTrip.id}
          onClose={() => setShowPopup(null)}
        />
      )}
    </div>
  );
};

export default AllTrips;
