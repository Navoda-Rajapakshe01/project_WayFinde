"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import AdminSidebar from "../../Components/AdminProfile/admin-sidebar";
import AdminHeader from "../../Components/AdminProfile/admin-header";
import "../CSS/AdminDashboard.css";
import "../../App.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, would redirect to login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Update activeSection based on URL path
  useEffect(() => {
    const section = location.pathname.split("/")[2] || "overview";
    setActiveSection(section);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <Outlet context={{ activeSection, setActiveSection }} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
