import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./ProfileHeadsection.css";


const ProfileHeadSection = () => {
  const [username, setUsername] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [bio, setBio] = useState("");
  const [blogCount, setBlogCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleEditClick = () => {
    window.scrollTo(0, 0);
    navigate("/settings");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        console.log("Fetching user profile data...");
        const response = await axios.get(
          "http://localhost:5030/api/profile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Profile data received:", response.data);

        // Extract user details from response
        const {
          username,
          profilePictureUrl,
          bio,
          blogsCount,
          blogCount,
          postsCount,
          postCount,
          followersCount,
          followingCount,
        } = response.data;

        // Set user profile data
        setUsername(username || "User");
        setProfilePictureUrl(profilePictureUrl);
        setBio(bio || "No bio available");

        // Set counts with fallbacks for different property names
        setBlogCount(blogsCount || blogCount || 0);
        setPostCount(postsCount || postCount || 0);
        setFollowerCount(followersCount || 0);
        setFollowingCount(followingCount || 0);
      } catch (error) {
        console.error(
          "Failed to fetch profile:",
          error.response?.data || error.message
        );
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    // Function to handle blog deletion events
    const handleBlogDeleted = () => {
      console.log("Blog deleted event received, updating count");
      setBlogCount((prevCount) => Math.max(0, prevCount - 1));
    };

    // Add event listener for blog deletion
    window.addEventListener("blogDeleted", handleBlogDeleted);

    // Fetch profile data on component mount
    fetchUserProfile();

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("blogDeleted", handleBlogDeleted);
    };
  }, []);

  return (
    <div className="profile-page">
      {loading ? (
        <div className="loading-indicator">Loading profile...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="profile-header">
          <img
            className="profile-avatar"
            src={profilePictureUrl || "/defaultprofilepicture.png"}
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/defaultprofilepicture.png";
            }}
          />
          <div className="profile-info">
            <h1>{username || "Loading..."}</h1>
            <div className="profile-stats">
              <div>
                <strong>Posts</strong>
                <br />
                {postCount}
              </div>
              <div>
                <strong>Blogs</strong>
                <br />
                {blogCount}
              </div>
              <div>
                <strong>Followers</strong>
                <br />
                {followersCount}
              </div>
              <div>
                <strong>Following</strong>
                <br />
                {followingCount}
              </div>
            </div>
            <p className="bio">{bio || "No bio available"}</p>

            <button
              className="edit-profile-btn"
              onClick={() => navigate("/settings")}
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <NavLink
          to="/profile/posts"
          className={({ isActive }) =>
            isActive ? "nav-tab active" : "nav-tab"
          }
        >
          Posts
        </NavLink>
        <NavLink
          to="/profile/profileBlogs"
          className={({ isActive }) =>
            isActive ? "nav-tab active" : "nav-tab"
          }
        >
          Blogs
        </NavLink>
        {/* <NavLink
          to="/profile/saved"
          className={({ isActive }) =>
            isActive ? "nav-tab active" : "nav-tab"
          }
        >
          Saved
        </NavLink> */}
        <NavLink
          to="/profile/trips"
          className={({ isActive }) =>
            isActive ? "nav-tab active" : "nav-tab"
          }
        >
          Trips
        </NavLink>
        {/* <NavLink
          to="/profile/reviews"
          className={({ isActive }) =>
            isActive ? "nav-tab active" : "nav-tab"
          }
        >
          Reviews
        </NavLink> */}
        <NavLink
          to="/profile/bookings"
          className={({ isActive }) =>
            isActive ? "nav-tab active" : "nav-tab"
          }
        >
          Bookings
        </NavLink>
      </div>
    </div>
  );
};

export default ProfileHeadSection;
