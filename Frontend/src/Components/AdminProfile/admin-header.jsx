"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import "../AdminProfile/admin-header.css";
import "../../App.css";
import * as signalR from "@microsoft/signalr";

const AdminHeader = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5030/notificationHub")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR");

        connection.on("ReceiveNotification", (message) => {
          const newNotification = {
            id: Date.now(),
            text: message,
            time: "Just now",
            read: false,
          };
          setNotifications((prev) => [newNotification, ...prev]);
        });
      })
      .catch((err) => {
        console.error("SignalR error:", err);
      });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <header className="admin-header">
      <div className="header-left"></div>

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
                <button
                  className="mark-read"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, read: true }))
                    )
                  }
                >
                  Mark All as Read
                </button>
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
