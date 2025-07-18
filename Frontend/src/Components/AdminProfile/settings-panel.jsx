"use client";
import React from "react";
import { useState } from "react";
import {
  FaGlobe,
  FaEnvelope,
  FaShieldAlt,
  FaBell,
  FaDatabase,
  FaSave,
  FaUndo,
  FaCloudUploadAlt,
  FaCheck,
  FaExclamationTriangle,
  FaCog,
} from "react-icons/fa";
import "../AdminProfile/settings-panel.css";
import "../../App.css";

const SettingsPanel = () => {
  const [siteName, setSiteName] = useState("WayFinde");
  const [contactEmail, setContactEmail] = useState("admin@wayfinde.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [backupInProgress, setBackupInProgress] = useState(false);

  const handleSave = () => {
    setFeedback("Settings saved successfully!");
    setTimeout(() => setFeedback(""), 2000);
  };

  const handleReset = () => {
    setSiteName("WayFinde");
    setContactEmail("admin@wayfinde.com");
    setEmailNotifications(true);
    setPushNotifications(false);
    setFeedback("Settings reset to default.");
    setTimeout(() => setFeedback(""), 2000);
  };

  const handleChangePassword = () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordSuccess("Password changed successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleBackup = () => {
    setBackupInProgress(true);
    setTimeout(() => {
      setBackupInProgress(false);
      setFeedback("Backup completed successfully!");
      setTimeout(() => setFeedback(""), 2000);
    }, 1500);
  };

  return (
    <div className="settings-management pro-bg">
      <div className="adminsection-header">
        <h1 className="page-title">Settings</h1>
      </div>
      <div className="settings-cards-wrapper">
        {feedback && (
          <div className="settings-feedback pro-animate">
            <FaCheck className="pro-icon-accent" /> {feedback}
          </div>
        )}
        <div className="admin-card pro-section-card">
          <div className="pro-section-header pro-section-header-accent">
            <FaGlobe className="pro-icon-accent" />
            <span>General</span>
          </div>
          <div className="settings-row">
            <label>Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="settings-row">
            <label>Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-card pro-section-card">
          <div className="pro-section-header pro-section-header-accent">
            <FaShieldAlt className="pro-icon-accent" />
            <span>Security</span>
          </div>
          <div className="settings-row">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="settings-password-row">
            <div className="settings-row">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="settings-row">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {passwordError && (
            <div className="settings-error pro-animate">
              <FaExclamationTriangle className="pro-icon-error" />{" "}
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="settings-success pro-animate">
              <FaCheck className="pro-icon-accent" /> {passwordSuccess}
            </div>
          )}
          <div className="settings-actions">
            <button className="adminsave-button" onClick={handleChangePassword}>
              <FaSave /> Change Password
            </button>
          </div>
        </div>
        <div className="admin-card pro-section-card">
          <div className="pro-section-header pro-section-header-accent">
            <FaDatabase className="pro-icon-accent" />
            <span>Data Management</span>
          </div>
          <div className="settings-actions">
            <button
              className="adminsave-button"
              onClick={handleBackup}
              disabled={backupInProgress}
            >
              <FaCloudUploadAlt />{" "}
              {backupInProgress ? "Backing Up..." : "Backup Data"}
            </button>
          </div>
        </div>
        <div className=" pro-section-card pro-actions-card">
          <div className="settings-actions pro-actions-footer">
            <button className="adminreset-button" onClick={handleReset}>
              <FaUndo /> Reset
            </button>
            <button className="adminsave-button" onClick={handleSave}>
              <FaSave /> Save All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
