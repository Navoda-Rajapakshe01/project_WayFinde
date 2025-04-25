import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // useLocation for automatic active tab
import logo from "../../assets/Images/logo.png";
import "./MainNavbar.css";

import {
  FaBook,
  FaBus,
  FaHome,
  FaHotel,
  FaPlaneDeparture,
} from "react-icons/fa";

const MainNavbar = () => {
  const location = useLocation(); // Use location to track current route
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the pop-up
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // Close pop-up when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".navbar-profile") &&
        !event.target.closest(".profile-popup")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Plan a Trip", icon: <FaPlaneDeparture />, path: "/plantrip" },
    { name: "Accommodation", icon: <FaHotel />, path: "/accommodation" },
    { name: "Vehicle", icon: <FaBus />, path: "/vehicle" },
    { name: "Blog", icon: <FaBook />, path: "/blog" },
    { name: "Things To Do", icon: <FaBook />, path: "/thingstodo" },
  ];

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  //Add the dynamic navigation
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path); // Navigate dynamically based on the clicked item
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="WAYFIND" />
        </div>
        <ul className="navbar-menu">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`navbar-item ${
                activeTab === item.path ? "active" : ""
              }`}
            >
              <Link to={item.path} className="navbar-link">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        {/* Profile Section */}
        <div className="navbar-profile" onClick={togglePopup}>
          <img
            src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
            alt="User Profile"
            className="profile-img"
          />
        </div>
        {/* Pop-up Section */}
        {isOpen && (
          <div className="profile-popup">
            <p onClick={() => handleNavigation("/profile")}>👤 Profile</p>
            <p onClick={() => handleNavigation("/plantrip")}>✈️ Trips</p>
            <p onClick={() => handleNavigation("/posts")}>📝 Posts</p>
            <p onClick={() => handleNavigation("/chat")}>💬 Chat</p>
            <p onClick={() => handleNavigation("/personalblog")}>📰 Blogs</p>
            <p onClick={() => handleNavigation("/settings")}>⚙️ Settings</p>
            <p onClick={() => handleNavigation("/logout")}>🔓 Logout</p>
          </div>
        )}
      </div>
      <div className="signButton">
        <button
          className="signInButton"
          onClick={() => handleNavigation("/signin")}
        >
          Sign In
        </button>
        <button
          className="signUpButton"
          onClick={() => handleNavigation("/signup")}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default MainNavbar;
