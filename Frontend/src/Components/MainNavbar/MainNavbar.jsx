import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext/AuthContext";
import { useProfileImage } from "../UserProfileComponents/ProfileImageContext/ProfileImageContext";
import "./MainNavbar.css";

const MainNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const [profileData, setProfileData] = useState({
    profileImage: "/defaultprofilepicture.png",
    username: "User",
    contactEmail: "user@example.com",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useAuth();
  const profileImageContext = useProfileImage();

  const user = authContext?.user;
  const loading = authContext?.loading;

  const profileImageFromContext =
    profileImageContext?.profileImage || "/defaultprofilepicture.png";

  const logout = useCallback(() => {
    if (authContext?.logout) {
      authContext.logout();
    } else {
      // Fallback logout logic
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  }, [authContext]);

  // Set active tab based on location - Fixed dependency array
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  // Close popup when clicking outside - Fixed event listener cleanup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".profile-popup")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignIn = useCallback(() => {
    navigate("/signin");
  }, [navigate]);

  const handleProfileMenuClick = (item) => {
    if (item.name === "Logout") {
      logout();
    } else {
      navigate(item.path);
    }
    setIsOpen(false);
  };

  const profileMenuItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
    {
      name: "Logout",
      path: "#",
      icon: "🚪",
    },
  ];

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Accommodation", path: "/accommodation" },
    { name: "Vehicle", path: "/vehicle" },
    { name: "Things to Do", path: "/thingstodo" },
    { name: "Blog", path: "/blog" },
    { name: "Trip Planner", path: "/plantrip" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/src/assets/Images/logo.png" alt="Logo" />
        </Link>

        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${activeTab === item.path ? "active" : ""}`}>
              {item.name}
            </Link>
          ))}
        </div>

        <div className="nav-auth">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : user ? (
            <div className="profile-section">
              <div
                className="profile-trigger"
                onClick={() => setIsOpen(!isOpen)}>
                <img
                  src={profileData.profileImage || profileImageFromContext}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.src = "/defaultprofilepicture.png";
                  }}
                />
                <span className="username">{profileData.username}</span>
                <span className="dropdown-arrow">▼</span>
              </div>

              {isOpen && (
                <div className="profile-popup">
                  {profileMenuItems.map((item) => (
                    <button
                      key={item.name}
                      className="profile-menu-item"
                      onClick={() => handleProfileMenuClick(item)}>
                      <span className="menu-icon">{item.icon}</span>
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="signin-btn" onClick={handleSignIn}>
                Sign In
              </button>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
