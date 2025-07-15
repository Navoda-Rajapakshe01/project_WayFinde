"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../Components/AdminProfile/admin-sidebar";
import AdminHeader from "../../Components/AdminProfile/admin-header";
import "../CSS/AdminDashboard.css";
import "../../App.css";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay
        const userData = localStorage.getItem("userProfile");
        if (userData && JSON.parse(userData)?.role === "Admin") {
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    /*
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated → redirecting...");
      navigate("/signin");
    }
      */
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
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <Outlet /> {/* Dynamically loads nested routes here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
