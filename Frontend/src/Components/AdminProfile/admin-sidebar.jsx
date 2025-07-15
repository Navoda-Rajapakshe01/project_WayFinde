import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaChartLine,
  FaHotel,
  FaCar,
} from "react-icons/fa";
import "../AdminProfile/admin-sidebar.css";
import "../../App.css";

const AdminSidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: <FaHome />, path: "/admin" },
    {
      id: "places",
      label: "Places",
      icon: <FaMapMarkerAlt />,
      path: "/admin/places-management",
    },
    {
      id: "users",
      label: "Users",
      icon: <FaUsers />,
      path: "/admin/users-management",
    },
    {
      id: "user-analytics",
      label: "User Analytics",
      icon: <FaChartLine />,
      path: "/admin/user-analytics",
    },
    {
      id: "accommodation",
      label: "Accommodation",
      icon: <FaHotel />,
      path: "/admin/accommodation-management",
    },
    {
      id: "vehicles",
      label: "Vehicles",
      icon: <FaCar />,
      path: "/admin/vehicles-management",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <FaStar />,
      path: "/admin/reviews-management",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FaCog />,
      path: "/admin/settings-panel",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">Admin Panel</div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => navigate(item.path)}
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
