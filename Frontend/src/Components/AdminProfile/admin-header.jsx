"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import "../AdminProfile/admin-header.css";
import "../../App.css";
import * as signalR from "@microsoft/signalr";

const AdminHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAllModal, setShowAllModal] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5030/notificationHub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      const handleNotification = (message) => {
        const newNotification = {
          id: Date.now(),
          text: message,
          time: "Just now",
          read: false,
        };
        setNotifications((prev) => [newNotification, ...prev]);
      };

      connection.on("ReceiveNotification", handleNotification);
    });

    return () => {
      connection.stop();
      connection.off("ReceiveNotification");
    };
  }, []);

  return (
    <header className="admin-header">
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
            <span
              className={`notification-badge${unreadCount > 0 ? " show" : ""}`}
            >
              {unreadCount > 0 ? unreadCount : ""}
            </span>
          </button>
          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <div className="notification-heading">
                <h3>Notifications</h3>
                {notifications.length > 2 && (
                  <button
                    className="clear-all"
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </button>
                )}
              </div>
              {notifications.length > 0 ? (
                <ul className="notification-list">
                  {notifications.slice(0, 3).map((notification) => (
                    <li
                      key={notification.id}
                      className={notification.read ? "read" : "unread"}
                    >
                      <div className="notification-item-content">
                        <p className="notification-text">{notification.text}</p>
                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>
                      <button
                        className="notification-clear-btn"
                        title="Clear notification"
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.filter((n) => n.id !== notification.id)
                          )
                        }
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-notifications">No notifications</p>
              )}
              {notifications.length > 0 && (
                <div className="dropdown-footer">
                  <button
                    onClick={() =>
                      notifications.length > 3 && setShowAllModal(true)
                    }
                    disabled={notifications.length <= 3}
                    style={{
                      visibility:
                        notifications.length > 3 ? "visible" : "hidden",
                      pointerEvents: notifications.length > 3 ? "auto" : "none",
                    }}
                  >
                    View all
                  </button>
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
              )}
            </div>
          )}
        </div>

        {showAllModal && (
          <div
            className="notifications-modal-backdrop"
            onClick={() => setShowAllModal(false)}
          >
            <div
              className="notifications-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="notifications-modal-close"
                onClick={() => setShowAllModal(false)}
                title="Close"
              >
                &times;
              </button>
              <h2>All Notifications</h2>
              <ul>
                {notifications.map((n) => (
                  <li key={n.id}>
                    {n.text} <span>{n.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

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
