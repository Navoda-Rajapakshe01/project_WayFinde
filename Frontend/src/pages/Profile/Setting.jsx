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

  useEffect(() => {
    fetchProfileDetails();
  }, []);

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

      <div className="delete-section">
        <label className="section-title">Delete account</label>
        <p>Reason for deleting the account</p>
        <textarea
          placeholder="Type here.."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <small>Send a request to admin to delete the account</small>
        <button className="btn delete-btn">Delete Account</button>
      </div>
    </div>
  );
};

export default Setting;
