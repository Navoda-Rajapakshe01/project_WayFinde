import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation for automatic active tab
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
            <p>👤 Profile</p>
            <p>✈️ Trips</p>
            <p>📝 Posts</p>
            <p>💬 Chat</p>
            <p>📰 Blogs</p>
            <p>⚙️ Settings</p>
            <p>🔓 Logout</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;
