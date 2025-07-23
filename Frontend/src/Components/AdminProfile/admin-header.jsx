"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUser } from "react-icons/fa";
import * as signalR from "@microsoft/signalr";
import "../AdminProfile/admin-header.css";
import "../../App.css";

const AdminHeader = ({ onShowPendingRequests }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAllModal, setShowAllModal] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5030/notificationHub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      connection.on("ReceiveNotification", (message) => {
        // message can be a string or an object
        const text = typeof message === 'string' ? message : message.text;
        // Mark if this is a delete request notification
        const isDeleteRequest = text && text.toLowerCase().includes('account deletion request');
        const newNotification = {
          id: Date.now(),
          text,
          url: undefined,
          time: "Just now",
          read: false,
          isDeleteRequest,
        };
        setNotifications((prev) => [newNotification, ...prev]);
      });
    });

    return () => {
      connection.off("ReceiveNotification");
      connection.stop();
    };
  }, []);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (userProfile && userProfile.email) {
      setAdminEmail(userProfile.email);
    }
  }, []);

  return (
    <header className="admin-header-container">
      <div className="admin-header-right">
        {/* 🔔 Notifications */}
        <div className="admin-header-notification">
          <button
            className="admin-header-icon-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <FaBell />
            <span
              className={`admin-header-badge ${
                unreadCount > 0 ? "show" : ""
              }`}
            >
              {unreadCount > 0 ? unreadCount : ""}
            </span>
          </button>

          {showNotifications && (
            <div className="admin-header-dropdown admin-header-dropdown-notifications">
              <div className="admin-header-dropdown-header">
                <h3>Notifications</h3>
                {notifications.length > 2 && (
                  <button
                    className="admin-header-clear-all"
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                <ul className="admin-header-notification-list">
                  {notifications.slice(0, 3).map((n) => (
                    <li
                      key={n.id}
                      className={n.read ? "read" : "unread"}
                      onClick={() => {
                        if (n.isDeleteRequest) {
                          if (onShowPendingRequests) {
                            onShowPendingRequests();
                          } else {
                            // Fire a custom event for parent to listen
                            window.dispatchEvent(new CustomEvent('show-pending-deletion-requests'));
                          }
                        } else if (n.url) {
                          navigate(n.url);
                        }
                      }}
                    >
                      <div className="admin-header-notification-content">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                      <button
                        className="admin-header-clear-btn"
                        title="Clear"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications((prev) =>
                            prev.filter((x) => x.id !== n.id)
                          );
                        }}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-header-no-notifications">
                  No notifications
                </p>
              )}

              {notifications.length > 0 && (
                <div className="admin-header-dropdown-footer">
                  <button
                    onClick={() =>
                      notifications.length > 3 && setShowAllModal(true)
                    }
                    disabled={notifications.length <= 3}
                    style={{
                      visibility:
                        notifications.length > 3 ? "visible" : "hidden",
                      pointerEvents:
                        notifications.length > 3 ? "auto" : "none",
                    }}
                  >
                    View All
                  </button>
                  <button
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

        {/* 📋 View All Modal */}
        {showAllModal && (
          <div
            className="admin-header-modal-backdrop"
            onClick={() => setShowAllModal(false)}
          >
            <div
              className="admin-header-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="admin-header-modal-close"
                onClick={() => setShowAllModal(false)}
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

        {/* 👤 Profile Dropdown */}
        <div className="admin-header-profile">
          <button
            className="admin-header-icon-button"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <div className="admin-header-avatar">
              <FaUser />
            </div>
          </button>

          {showProfile && (
            <div className="admin-header-dropdown admin-header-dropdown-profile">
              <div className="admin-header-profile-info">
                <div className="admin-header-avatar-large">
                  <FaUser />
                </div>
                <div>
                  <h4>Admin User</h4>
                  <p>{adminEmail}</p>
                </div>
              </div>
              <ul style={{margin: 0, padding: 0}}>
                <li
                  className="admin-header-logout"
                  style={{borderTop: "none"}}
                  onClick={() => {
                    localStorage.removeItem("userProfile");
                    localStorage.removeItem("token");
                    navigate("/signin");
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
