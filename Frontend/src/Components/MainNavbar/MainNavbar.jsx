import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation for automatic active tab
import logo from "../../assets/Images/logo.png";
import "./MainNavbar.css";

import {
  FaHome,
  FaPlaneDeparture,
  FaHotel,
  FaBus,
  FaBook,
} from "react-icons/fa";

const MainNavbar = () => {
  const location = useLocation(); // Use location to track current route
  const [activeTab, setActiveTab] = useState(location.pathname);

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
              }`}>
              <Link to={item.path} className="navbar-link">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="navbar-profile">
          <img
            src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
            alt="User Profile"
            className="profile-img"
          />
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
