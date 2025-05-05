"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../../Components/AdminProfile/admin-sidebar"
import AdminHeader from "../../Components/AdminProfile/admin-header"
import DashboardOverview from "../../Components/AdminProfile/dashboard-overview"
import PlacesManagement from "../../Components/AdminProfile/places-management"
import DistrictsManagement from "../../Components/AdminProfile/districts-management"
import UsersManagement from "../../Components/AdminProfile/users-management"
import UserAnalytics from "../../Components/AdminProfile/user-analytics"
import AccommodationManagement from "../../Components/AdminProfile/accommodation-management"
import VehicleManagement from "../../Components/AdminProfile/vehicle-management"
import ReviewsManagement from "../../Components/AdminProfile/reviews-management"
import BlogManagement from "../../Components/AdminProfile/blog-management"
import SettingsPanel from "../../Components/AdminProfile/settings-panel"
import "../CSS/AdminDashboard.css"
import "../../App.css"

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  // Check authentication status
  useEffect(() => {
    // This would be replaced with your actual authentication check
    const checkAuth = async () => {
      try {
        // Simulate API call to check authentication
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll assume the user is authenticated
        // In a real app, you would check a token or session
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Authentication error:", error)
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // In a real app, redirect to login page
      // navigate("/admin/login")
      console.log("User not authenticated, would redirect to login")
    }
  }, [isLoading, isAuthenticated, navigate])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  // Render main dashboard
  return (
    <div className={`admin-dashboard ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} collapsed={sidebarCollapsed} />

      <div className="admin-main">
        <AdminHeader toggleSidebar={toggleSidebar} />

        <div className="admin-content">
          {activeSection === "overview" && <DashboardOverview />}
          {activeSection === "places" && <PlacesManagement />}
          {activeSection === "districts" && <DistrictsManagement />}
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
  )
}

export default AdminDashboard
