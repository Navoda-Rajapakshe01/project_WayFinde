import React, { useContext, useRef, useState } from "react";
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

  // This function uploads to backend, which uploads to Cloudinary and saves URL in DB
  const handleSaveProfileImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);

    const res = await fetch(
      "https://localhost:7138/api/user/upload-profile-picture",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.profilePictureUrl) {
      setProfileImage(data.profilePictureUrl); // Update context
      setPreviewImage(null);
      setSelectedFile(null);
      setShowSaveButton(false);
    }
  };

  // Optionally, add a cancel button to discard changes
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
        <button className="btn change-btn">Done</button>
      </div>

      <div className="password-section">
        <label className="section-title">Change Password</label>
        <input type="password" placeholder="Current Password" />
        <input type="password" placeholder="New Password" />
        <input type="password" placeholder="Re-enter New Password" />
        <button className="btn change-btn">Change Password</button>
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

export default ProfileSettings;
