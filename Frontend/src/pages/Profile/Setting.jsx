import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProfileImageContext } from "../../Components/UserProfileComponents/ProfileImageContext/ProfileImageContext";
import "../CSS/Setting.css"; // Import your CSS file for styling

const ProfileSettings = () => {
  const { profileImage, setProfileImage } = useContext(ProfileImageContext);
  const [bio, setBio] = useState("");
  const [reason, setReason] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const fileInputRef = useRef(null);
  const maxBioLength = 150;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const DELETION_REASONS = [
    "I have privacy concerns",
    "I don't find the service useful",
    "I have multiple accounts",
    "Other"
  ];
  const [deletionRequest, setDeletionRequest] = useState(null);
  const [deletionLoading, setDeletionLoading] = useState(false);
  const [deletionError, setDeletionError] = useState(null);
  const [deletionSuccess, setDeletionSuccess] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [hasTriedDelete, setHasTriedDelete] = useState(false);

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  useEffect(() => {
    // Fetch account deletion request status
    const fetchDeletionRequest = async () => {
      try {
        setDeletionLoading(true);
        setDeletionError(null);
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("userProfile"));
        if (!user?.id) return;
        const res = await axios.get(`http://localhost:5030/api/account-deletion/requests`);
        // Handle .NET $values arrays
        const data = res.data?.$values || res.data;
        // Find the request for this user
        const req = data.find(r => (r.userId === user.id || r.userId === user.Id));
        setDeletionRequest(req || null);
      } catch (err) {
        setDeletionError("Failed to fetch account deletion request status.");
      } finally {
        setDeletionLoading(false);
      }
    };
    fetchDeletionRequest();
  }, []);

  useEffect(() => {
    if (deletionRequest && deletionRequest.status === 'Approved') {
      // Show goodbye message, then logout and redirect
      setTimeout(() => {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }, 3000); // 3 seconds
    }
  }, [deletionRequest]);

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5030/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { profilePictureUrl, bio } = response.data;
      setBio(bio || "");
      setProfileImage(
        profilePictureUrl || "Frontend/public/DefaultProfileImage.jpg"
      );
      console.log("Fetched bio:", bio);
      console.log("Fetched profile picture:", profilePictureUrl);
    } catch (error) {
      console.error(
        "Error fetching profile:",
        error.response?.data || error.message
      );
      alert("Failed to load bio");
    }
  };

  const handleBioSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5030/api/profile/update-bio",
        { bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Bio saved successfully!");
      console.log("Bio update response:", response.data);
    } catch (error) {
      console.error("Error saving bio:", error.response?.data || error.message);
      alert("Failed to save bio");
    }
  };

  const handleChangePassword = async () => {
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

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5030/api/profile/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setPasswordSuccess("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error(error);
      setPasswordError(
        error.response?.data || "Failed to change password. Try again."
      );
    }
  };

  const handleRequestDeletion = async () => {
    setHasTriedDelete(true);
    setDeletionLoading(true);
    setDeletionError(null);
    setDeletionSuccess(null);
    try {
      const user = JSON.parse(localStorage.getItem("userProfile"));
      if (!user?.id) throw new Error("User not found");
      await axios.post(`http://localhost:5030/api/account-deletion/request`, JSON.stringify(user.id), {
        headers: { 'Content-Type': 'application/json' }
      });
      setDeletionSuccess("Your account deletion request has been sent to the admin.");
      setDeletionRequest({ status: "Pending" });
      setSelectedReason("");
    } catch (err) {
      setDeletionError(err.response?.data || "Failed to send request.");
    } finally {
      setDeletionLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setShowSaveButton(true);
    }
  };

  const handleSaveProfileImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5030/api/profile/upload-profile-picture",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();

        if (data.profilePictureUrl) {
          setProfileImage(data.profilePictureUrl);
          setPreviewImage(null);
          setSelectedFile(null);
          setShowSaveButton(false);
        }
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload image. Check console for details.");
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setShowSaveButton(false);
  };

  // Add a function to clear declined request
  const handleClearDeclinedRequest = async () => {
    try {
      setDeletionLoading(true);
      setDeletionError(null);
      const user = JSON.parse(localStorage.getItem("userProfile"));
      if (!user?.id) throw new Error("User not found");
      // Find the declined request for this user
      const res = await axios.get(`http://localhost:5030/api/account-deletion/requests`);
      const data = res.data?.$values || res.data;
      const req = data.find(r => (r.userId === user.id || r.userId === user.Id) && r.status === 'Declined');
      if (!req) throw new Error("No declined request found");
      // Delete the declined request (assume DELETE endpoint exists)
      await axios.delete(`http://localhost:5030/api/account-deletion/${req.id}`);
      setDeletionRequest(null);
      setDeletionSuccess(null);
      setSelectedReason("");
      // Focus the reason dropdown after clearing
      setTimeout(() => {
        const dropdown = document.querySelector('.account-deletion-dropdown');
        if (dropdown) dropdown.focus();
      }, 100);
    } catch (err) {
      setDeletionError("Failed to clear declined request. Please try again later.");
    } finally {
      setDeletionLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-picture-section">
        <img
          src={
            previewImage ||
            profileImage ||
            "Frontend/public/DefaultProfileImage.jpg"
          }
          alt="Profile"
          className="profile-picture"
        />
        <h2 onClick={handleImageClick} className="clickable-text">
          Change profile picture
        </h2>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        {showSaveButton && (
          <div>
            <button className="btn change-btn" onClick={handleSaveProfileImage}>
              Save
            </button>
            <button className="btn cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bio-section">
        <label className="section-title">Bio</label>
        <textarea
          placeholder="Type here"
          value={bio}
          maxLength={maxBioLength}
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="char-count">
          {bio.length}/{maxBioLength}
        </div>
        <button className="btn change-btn" onClick={handleBioSave}>
          Done
        </button>
      </div>

      <div className="password-section">
        <label className="section-title">Change Password</label>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Re-enter New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="btn change-btn" onClick={handleChangePassword}>
          Change Password
        </button>
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        {passwordSuccess && <p style={{ color: "green" }}>{passwordSuccess}</p>}
      </div>
      {/* Account Deletion Section */}
      <div className="delete-section">
        <label className="section-title">Delete Account</label>
        <div style={{ margin: '12px 0 18px 0', color: '#7b8794', fontSize: '1rem' }}>
          You can request to delete your account. Please select a reason and confirm.
        </div>
        {deletionLoading && <div>Loading account deletion status...</div>}
        {hasTriedDelete && deletionError && (
          <div style={{ color: 'red' }}>
            {deletionError === 'User not found.'
              ? 'Your account could not be found. Please log out and log in again.'
              : deletionError === 'A pending deletion request already exists.'
              ? 'You already have a pending account deletion request.'
              : 'Failed to send account deletion request. Please try again later.'}
          </div>
        )}
        {deletionSuccess && <div style={{ color: 'green' }}>{deletionSuccess}</div>}
        {deletionRequest ? (
          <div
            className={`account-deletion-status ${deletionRequest.status?.toLowerCase()}`}
            style={{
              margin: '24px auto',
              maxWidth: 400,
              background: '#f4f6fa', // lighter neutral background
              border: '1px solid #d1d5db', // subtle border
              borderRadius: 10,
              padding: '24px 20px',
              boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
              textAlign: 'center',
            }}
          >
            <strong style={{ fontSize: '1.1rem', color: '#e74c3c' }}>
              Account Deletion Request Status
            </strong>
            <div style={{ margin: '12px 0 0 0', fontSize: '1.05rem', color: '#1a3456' }}>
              {deletionRequest.status === 'Declined' ? (
                <span style={{ color: '#e74c3c', fontWeight: 600 }}>{deletionRequest.status}</span>
              ) : (
                deletionRequest.status
              )}
            </div>
            {deletionRequest.status === 'Declined' && deletionRequest.adminReply && (
              <>
                <div className="account-deletion-status declined" style={{ marginTop: 10, color: '#b94a48', background: '#fff3f3', borderRadius: 6, padding: '10px 12px', border: '1px solid #f5c6cb', fontSize: '1rem' }}>
                  <strong style={{ color: '#e74c3c' }}>Admin Reply:</strong> <span style={{ color: '#333' }}>{deletionRequest.adminReply}</span>
                </div>
                <button
                  className="btn delete-btn account-deletion-btn-small"
                  style={{ marginTop: 18, background: '#2563eb', color: '#fff', padding: '8px 20px', fontSize: '1rem', borderRadius: 6, border: 'none', fontWeight: 500 }}
                  onClick={handleClearDeclinedRequest}
                  disabled={deletionLoading}
                >
                  Clear and Re-request
                </button>
              </>
            )}
            {deletionRequest.status === 'Pending' && (
              <div className="account-deletion-status pending" style={{ marginTop: 10, color: '#129bb3' }}>
                Your request is being reviewed by the admin.
              </div>
            )}
            {deletionRequest.status === 'Approved' && (
              <div className="account-deletion-status approved" style={{ marginTop: 10, color: '#27ae60' }}>
                Your account will be deleted soon.<br />
                <span style={{ color: '#1a3456', fontWeight: 500 }}>
                  You will be logged out in a moment. Thank you for using our service!
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <select
                className="account-deletion-dropdown"
                value={selectedReason}
                onChange={e => setSelectedReason(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem', minWidth: 220 }}
              >
                <option value="">Select a reason...</option>
                {DELETION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <button
              className="btn delete-btn account-deletion-btn-small"
              onClick={handleRequestDeletion}
              disabled={!selectedReason || deletionLoading}
              style={{ background: '#e74c3c', color: '#fff', padding: '8px 20px', fontSize: '1rem', borderRadius: 6, border: 'none', fontWeight: 500 }}
            >
              Delete My Account
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
