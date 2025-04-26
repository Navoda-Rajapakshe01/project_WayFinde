import { useContext, useEffect, useState } from "react";
import {
  FaBook,
  FaBus,
  FaHome,
  FaHotel,
  FaPlaneDeparture,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import { AuthContext } from "../Authentication/AuthContext/AuthContext";
import "./MainNavbar.css";

const MainNavbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Toggle profile popup
  const togglePopup = () => setIsOpen(!isOpen);

  // Close popup when clicking outside
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

  // Update active tab on route change
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Plan a Trip", icon: <FaPlaneDeparture />, path: "/plantrip" },
    { name: "Accommodation", icon: <FaHotel />, path: "/accommodation" },
    { name: "Vehicle", icon: <FaBus />, path: "/vehicle" },
    { name: "Blog", icon: <FaBook />, path: "/blog" },
    { name: "Things To Do", icon: <FaBook />, path: "/thingstodo" },
  ];

  const handleNavigation = (path) => navigate(path);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <img src={logo} alt="WAYFIND" />
        </div>

        {/* Main Navigation Menu */}
        <ul className="navbar-menu">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`navbar-item${
                activeTab === item.path ? " active" : ""
              }`}
            >
              <Link to={item.path} className="navbar-link">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile or Auth Buttons */}
        <div className="navbar-auth-section">
          {user ? (
            <div className="navbar-profile" onClick={togglePopup}>
              <img
                src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
                alt="User Profile"
                className="profile-img"
              />
              {isOpen && (
                <div className="profile-popup">
                  <p onClick={() => handleNavigation("/profile")}>👤 Profile</p>
                  <p onClick={() => handleNavigation("/plantrip")}>✈️ Trips</p>
                  <p onClick={() => handleNavigation("/posts")}>📝 Posts</p>
                  <p onClick={() => handleNavigation("/chat")}>💬 Chat</p>
                  <p onClick={() => handleNavigation("/personalblog")}>
                    📰 Blogs
                  </p>
                  <p onClick={() => handleNavigation("/settings")}>
                    ⚙️ Settings
                  </p>
                  <p onClick={logout}>🔓 Logout</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <button
                // className="navbar-link"
                onClick={() => handleNavigation("/signin")}
              >
                Sign In
              </button>
              
              {/* <button
                className="navbar-link"
                onClick={() => handleNavigation("/signup")}
              >
                Sign Up
              </button> */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
