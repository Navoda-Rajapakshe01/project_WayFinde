import React, { useContext, useRef, useState } from "react";
import { ProfileImageContext } from "../../Components/UserProfileComponents/ProfileImageContext/ProfileImageContext";
import "../CSS/Setting.css"; // Import your CSS file for styling

const ProfileSettings = () => {
  const { profileImage, setProfileImage } = useContext(ProfileImageContext);
  const [bio, setBio] = useState("");
  const [reason, setReason] = useState("");
  const fileInputRef = useRef(null);
  const maxBioLength = 150;

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optionally show preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      // Prepare form data
      const formData = new FormData();
      formData.append("image", file);

      // Send to backend
      const res = await fetch(
        "https://localhost:7138/api/user/upload-profile-picture",
        {
          method: "POST",
          body: formData,
          credentials: "include", // if you use cookies/auth
        }
      );
      const data = await res.json();
      if (data.profilePictureUrl) {
        setProfileImage(data.profilePictureUrl);
        // Optionally update user context here
      }
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-picture-section">
        <img
          src={profileImage || "/default-profile.png"}
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
