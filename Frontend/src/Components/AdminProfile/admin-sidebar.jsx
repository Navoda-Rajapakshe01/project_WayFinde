"use client";
import React, { useState } from "react";
import {
  FaHome,
  FaMapMarkerAlt,
  FaCity,
  FaUsers,
  FaStar,
  FaBlog,
  FaCog,
  FaSignOutAlt,
  FaChartLine,
  FaHotel,
  FaCar,
} from "react-icons/fa";
import "../AdminProfile/admin-sidebar.css";
import "../../App.css";

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: <FaHome /> },
    { id: "places", label: "Places", icon: <FaMapMarkerAlt /> },
    { id: "districts", label: "Districts", icon: <FaCity /> },
    { id: "users", label: "Users", icon: <FaUsers /> },
    { id: "user-analytics", label: "User Analytics", icon: <FaChartLine /> },
    { id: "accommodation", label: "Accommodation", icon: <FaHotel /> },
    { id: "vehicles", label: "Vehicles", icon: <FaCar /> },
    { id: "reviews", label: "Reviews", icon: <FaStar /> },
    { id: "blog", label: "Blog", icon: <FaBlog /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header"></div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activeSection === item.id ? "active" : ""}
              onClick={() => setActiveSection(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="menu-item">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </div>
              {hoveredItem === item.id && (
                <div className="tooltip">{item.label}</div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <span className="menu-icon">
            <FaSignOutAlt />
          </span>
          <span className="menu-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
