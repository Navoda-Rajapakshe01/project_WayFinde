"use client";
import React, { useState, useEffect } from "react";
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
  const [contactNumber, setContactNumber] = useState("+94 xx xxx xxxx");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [backupInProgress, setBackupInProgress] = useState(false);

  // Load siteSettings from localStorage on mount
  useEffect(() => {
    const settings = localStorage.getItem("siteSettings");
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.siteName) setSiteName(parsed.siteName);
        if (parsed.contactEmail) setContactEmail(parsed.contactEmail);
        if (parsed.contactNumber) setContactNumber(parsed.contactNumber);
      } catch {}
    }
  }, []);

  const handleSave = () => {
    setFeedback("Settings saved successfully!");
    setTimeout(() => setFeedback(""), 2000);
    // Optionally, persist to localStorage or backend here
    localStorage.setItem("siteSettings", JSON.stringify({
      siteName,
      contactEmail,
      contactNumber,
    }));
  };

  const handleReset = () => {
    setSiteName("WayFinde");
    setContactEmail("admin@wayfinde.com");
    setContactNumber("+94 xx xxx xxxx");
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

  const handleBackup = async () => {
    setBackupInProgress(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5030/api/backup/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to download backup");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Try to get filename from response header, fallback to default
      const disposition = response.headers.get("Content-Disposition");
      let filename = "wayfinde-backup.json";
      if (disposition && disposition.indexOf("filename=") !== -1) {
        filename = disposition.split("filename=")[1].replace(/['"]/g, "");
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setFeedback("Backup completed successfully!");
    } catch (err) {
      setFeedback("Backup failed: " + (err.message || err));
    } finally {
      setBackupInProgress(false);
      setTimeout(() => setFeedback(""), 2000);
    }
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
          <div className="settings-row">
            <label>Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          {/* Save/Reset buttons inside the card */}
          <div className="settings-actions pro-actions-footer">
            <button className="adminreset-button" onClick={handleReset}>
              <FaUndo /> Reset
            </button>
            <button className="adminsave-button" onClick={handleSave}>
              <FaSave /> Save All
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
      </div>
    </div>
  );
};

export default SettingsPanel;
