"use client"
import React from "react"
import { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa"

const DistrictsManagement = () => {
  const [districts, setDistricts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentDistrict, setCurrentDistrict] = useState(null)

  useEffect(() => {
    // Simulate API call to fetch districts
    const fetchDistricts = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockDistricts = [
          {
            id: 1,
            name: "Colombo",
            placeCount: 24,
            description: "The commercial capital of Sri Lanka",
            imageUrl: "https://example.com/colombo.jpg",
          },
          {
            id: 2,
            name: "Galle",
            placeCount: 18,
            description: "Famous for its Dutch colonial architecture",
            imageUrl: "https://example.com/galle.jpg",
          },
          {
            id: 3,
            name: "Kandy",
            placeCount: 22,
            description: "Home to the Temple of the Sacred Tooth Relic",
            imageUrl: "https://example.com/kandy.jpg",
          },
          {
            id: 4,
            name: "Matale",
            placeCount: 15,
            description: "Known for spice gardens and Sigiriya",
            imageUrl: "https://example.com/matale.jpg",
          },
          {
            id: 5,
            name: "Nuwara Eliya",
            placeCount: 17,
            description: "The 'Little England' of Sri Lanka",
            imageUrl: "https://example.com/nuwara-eliya.jpg",
          },
          {
            id: 6,
            name: "Badulla",
            placeCount: 12,
            description: "Known for Ella and beautiful landscapes",
            imageUrl: "https://example.com/badulla.jpg",
          },
          {
            id: 7,
            name: "Hambantota",
            placeCount: 10,
            description: "Home to Yala National Park",
            imageUrl: "https://example.com/hambantota.jpg",
          },
        ]

        setDistricts(mockDistricts)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching districts:", error)
        setIsLoading(false)
      }
    }

    fetchDistricts()
  }, [])

  const handleAddDistrict = () => {
    setCurrentDistrict(null)
    setShowAddModal(true)
  }

  const handleEditDistrict = (district) => {
    setCurrentDistrict(district)
    setShowAddModal(true)
  }

  const handleDeleteDistrict = (districtId) => {
    if (window.confirm("Are you sure you want to delete this district?")) {
      // In a real app, this would be an API call
      setDistricts(districts.filter((district) => district.id !== districtId))
    }
  }

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading districts...</p>
      </div>
    )
  }

  return (
    <div className="districts-management">
      <div className="section-header">
        <h1 className="page-title">Districts Management</h1>
        <button className="add-button" onClick={handleAddDistrict}>
          <FaPlus /> Add New District
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="districts-grid">
        {filteredDistricts.map((district) => (
          <div key={district.id} className="district-card">
            <div className="district-image">
              <img src={district.imageUrl || "/placeholder.svg"} alt={district.name} />
            </div>
            <div className="district-content">
              <h3>{district.name}</h3>
              <p className="district-description">{district.description}</p>
              <div className="district-meta">
                <span className="place-count">{district.placeCount} places</span>
              </div>
            </div>
            <div className="district-actions">
              <button className="edit-button" onClick={() => handleEditDistrict(district)} title="Edit">
                <FaEdit />
              </button>
              <button className="delete-button" onClick={() => handleDeleteDistrict(district.id)} title="Delete">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{currentDistrict ? "Edit District" : "Add New District"}</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form className="form">
                <div className="form-group">
                  <label htmlFor="name">District Name</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={currentDistrict?.name || ""}
                    placeholder="Enter district name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    defaultValue={currentDistrict?.description || ""}
                    placeholder="Enter district description"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="text"
                    id="imageUrl"
                    defaultValue={currentDistrict?.imageUrl || ""}
                    placeholder="Enter image URL"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="save-button">Save District</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DistrictsManagement
