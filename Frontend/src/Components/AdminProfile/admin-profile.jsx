import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import "./admin-header.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "Admin User",
    email: "",
    role: "Administrator",
    joined: "",
    lastLogin: ""
  });

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (userProfile) {
      setAdmin((prev) => ({
        ...prev,
        email: userProfile.email || "",
        name: userProfile.name || "Admin User",
        joined: userProfile.joined || "",
        lastLogin: userProfile.lastLogin || ""
      }));
    }
  }, []);

  return (
    <div className="admin-profile-card">
      <div className="admin-profile-avatar">
        <FaUser size={64} />
      </div>
      <h2>{admin.name}</h2>
      <p><strong>Email:</strong> {admin.email}</p>
      <p><strong>Role:</strong> {admin.role}</p>
      {admin.joined && <p><strong>Joined:</strong> {admin.joined}</p>}
      {admin.lastLogin && <p><strong>Last Login:</strong> {admin.lastLogin}</p>}
      <div className="admin-profile-actions">
        <button disabled>Edit Profile</button>
        <button disabled>Change Password</button>
      </div>
    </div>
  );
};

export default AdminProfile;
