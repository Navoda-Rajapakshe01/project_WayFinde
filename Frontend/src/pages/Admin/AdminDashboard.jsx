"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminProfile/admin-sidebar";
import AdminHeader from "../../Components/AdminProfile/admin-header";
import DashboardOverview from "../../Components/AdminProfile/dashboard-overview";
import PlacesManagement from "../../Components/AdminProfile/places-management";
import UsersManagement from "../../Components/AdminProfile/users-management";
import UserAnalytics from "../../Components/AdminProfile/user-analytics";
import AccommodationManagement from "../../Components/AdminProfile/accommodation-management";
import VehicleManagement from "../../Components/AdminProfile/vehicle-management";
import ReviewsManagement from "../../Components/AdminProfile/reviews-management";
import BlogManagement from "../../Components/AdminProfile/blog-management";
import SettingsPanel from "../../Components/AdminProfile/settings-panel";
import "../CSS/AdminDashboard.css";
import "../../App.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // navigate("/admin/login");
      console.log("User not authenticated, would redirect to login");
    }
  }, [isLoading, isAuthenticated, navigate]);

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
          {activeSection === "overview" && <DashboardOverview />}
          {activeSection === "places" && <PlacesManagement />}
          {activeSection === "users" && <UsersManagement />}
          {activeSection === "user-analytics" && <UserAnalytics />}
          {activeSection === "accommodation" && <AccommodationManagement />}
          {activeSection === "vehicles" && <VehicleManagement />}
          {activeSection === "reviews" && <ReviewsManagement />}
          {activeSection === "blog" && <BlogManagement />}
          {activeSection === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
