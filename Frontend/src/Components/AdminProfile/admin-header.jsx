"use client";
import React from "react";
import { useState } from "react";
import {  FaBell, FaSearch, FaUser } from "react-icons/fa";
import "../AdminProfile/admin-header.css";
import "../../App.css";

const AdminHeader = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, text: "New user registered", time: "5 minutes ago", read: false },
    {
      id: 2,
      text: "New review submitted for Sigiriya",
      time: "1 hour ago",
      read: false,
    },
    { id: 3, text: "System update scheduled", time: "2 hours ago", read: true },
    {
      id: 4,
      text: "Backup completed successfully",
      time: "Yesterday",
      read: true,
    },
  ];

  return (
    <header className="admin-header">
      <div className="header-left">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>

      <div className="header-right">
        <div className="notification-container">
          <button
            className="notification-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <FaBell />
            <span className="notification-badge">
              {notifications.filter((n) => !n.read).length}
            </span>
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <h3>Notifications</h3>
              {notifications.length > 0 ? (
                <ul className="notification-list">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={notification.read ? "read" : "unread"}
                    >
                      <p className="notification-text">{notification.text}</p>
                      <span className="notification-time">
                        {notification.time}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-notifications">No notifications</p>
              )}
              <div className="dropdown-footer">
                <button className="view-all">View All</button>
                <button className="mark-read">Mark All as Read</button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-container">
          <button
            className="profile-button"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <div className="profile-avatar">
              <FaUser />
            </div>
          </button>

          {showProfile && (
            <div className="dropdown-menu profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  <FaUser />
                </div>
                <div className="profile-info">
                  <h4>Admin User</h4>
                  <p>admin@wayfinde.com</p>
                </div>
              </div>
              <ul className="profile-menu">
                <li>My Profile</li>
                <li>Account Settings</li>
                <li>Help Center</li>
                <li className="logout">Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
