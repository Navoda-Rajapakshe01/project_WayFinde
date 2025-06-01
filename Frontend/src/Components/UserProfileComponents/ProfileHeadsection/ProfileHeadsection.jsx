import axios from "axios";
import  { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ProfileHeadSection = () => {
  const [username, setUsername] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5030/api/profile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { username, profilePictureUrl } = response.data;
        setUsername(username);
        setProfilePictureUrl(profilePictureUrl);
      } catch (error) {
        console.error(
          "Failed to fetch profile:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          className="profile-avatar"
          src={profilePictureUrl || "defaultprofilepicture.png"}
          alt="Profile"
        />
        <div className="profile-info">
          <h1>{username || "Loading..."}</h1>
          <div className="profile-stats">
            <div>
              <strong>Posts</strong>
              <br />
              15
            </div>
            <div>
              <strong>Blogs</strong>
              <br />5
            </div>
            <div>
              <strong>Followers</strong>
              <br />
              512
            </div>
            <div>
              <strong>Following</strong>
              <br />
              300
            </div>
          </div>
          <p className="bio">
            Exploring hidden gems around the world, one journey at a time! ✈️
            <br />
            🌍 Always looking for the next great adventure.
          </p>
          <button
            className="edit-profile-btn"
            onClick={() => navigate("/settings")}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <NavLink to="/profile/posts" activeClassName="active">
          Posts
        </NavLink>
        <NavLink to="/profile/profileBlogs" activeClassName="active">
          Blogs
        </NavLink>
        <NavLink to="/profile/saved" activeClassName="active">
          Saved
        </NavLink>
        <NavLink to="/profile/trips" activeClassName="active">
          Trips
        </NavLink>
        <NavLink to="/profile/reviews" activeClassName="active">
          Reviews
        </NavLink>
        <NavLink to="/profile/bookings" activeClassName="active">
          Bookings
        </NavLink>
      </div>
    </div>
  );
};

export default ProfileHeadSection;
