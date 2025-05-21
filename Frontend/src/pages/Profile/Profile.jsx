// import { useContext } from "react";
// import { AuthContext } from "../../Components/Authentication/AuthContext/AuthContext";
// import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
// import "../CSS/Profile.css"; // Import your CSS file for styling
// import React from "react";

// const Profile = () => {
//   const { user } = useContext(AuthContext);

//   if (!user) {
//     return <p>Please log in to view your profile.</p>;
//   }

//   return (
//     <div className="page-container">
//       <ProfileHeadSection />
//     </div>
//   );
// };

// export default Profile;
// src/components/ProfilePage.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import "../CSS/Profile.css";

const ProfilePage = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5030/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { username } = response.data;
        setUsername(username);
      } catch (error) {
        console.error("Failed to fetch profile:", error.response?.data || error.message);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          className="profile-avatar"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
        <div className="profile-info">
          <h1>{username || "Loading..."}</h1>
          <div className="profile-stats">
            <div><strong>Posts</strong><br />15</div>
            <div><strong>Blogs</strong><br />5</div>
            <div><strong>Followers</strong><br />512</div>
            <div><strong>Following</strong><br />300</div>
          </div>
          <p className="bio">
            Exploring hidden gems around the world, one journey at a time! ✈️<br />
            🌍 Always looking for the next great adventure.
          </p>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>

      <div className="profile-tabs">
        <span className="active">Posts</span>
        <span>Blogs</span>
        <span>Saved</span>
        <span>Trips</span>
        <span>Reviews</span>
        <span>Bookings</span>
      </div>

      <div className="gallery">
        {[
          "https://via.placeholder.com/200x200",
          "https://via.placeholder.com/200x200",
          "https://via.placeholder.com/200x200",
          "https://via.placeholder.com/200x200",
          "https://via.placeholder.com/200x200",
          "https://via.placeholder.com/200x200",
        ].map((src, index) => (
          <img key={index} src={src} alt={`Gallery ${index}`} className="gallery-image" />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;

