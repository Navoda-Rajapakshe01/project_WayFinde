import { useContext, useEffect, useState } from "react";
import {
  FaBook,
  FaBus,
  FaCog,
  FaComments,
  FaHome,
  FaHotel,
  FaNewspaper,
  FaPencilAlt,
  FaPlaneDeparture,
  FaSignOutAlt,
  FaSuitcase,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import { AuthContext } from "../Authentication/AuthContext/AuthContext";
import "./MainNavbar.css";

const MainNavbar = () => {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

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

  const profileMenuItems = [
    { name: "Profile", icon: <FaUserCircle />, path: "/profile" },
    { name: "Trips", icon: <FaSuitcase />, path: "/plantrip" },
    { name: "Posts", icon: <FaPencilAlt />, path: "/posts" },
    { name: "Chat", icon: <FaComments />, path: "/chat" },
    { name: "Blogs", icon: <FaNewspaper />, path: "/personalblog" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
    { name: "Logout", icon: <FaSignOutAlt />, path: null },
  ];

  const handleNavigation = (path) => navigate(path);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo || "/placeholder.svg"} alt="WAYFIND" />
          </Link>
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
                <span className="navbar-icon">{item.icon}</span>
                <span className="navbar-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile or Auth Buttons */}
        <div className="navbar-auth-section">
          {user ? (
            <div className="navbar-profile" onClick={togglePopup}>
              <div className="profile-wrapper">
                <img
                  src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
                  alt="User Profile"
                  className="profile-img"
                />
                <span className="profile-indicator"></span>
              </div>

              {isOpen && (
                <div className="profile-popup">
                  <div className="popup-header">
                    <img
                      src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
                      alt="User Profile"
                      className="popup-profile-img"
                    />
                    <div className="popup-user-info">
                      <h4>John Doe</h4>
                      <p>john.doe@example.com</p>
                    </div>
                  </div>

                  <div className="popup-divider"></div>

                  <div className="popup-menu">
                    {profileMenuItems.map((item) => (
                      <div
                        key={item.name}
                        className="popup-item"
                        onClick={() => {
                          if (item.name === "Logout") {
                            logout();
                          } else {
                            handleNavigation(item.path);
                          }
                        }}
                      >
                        <span className="popup-icon">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
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
