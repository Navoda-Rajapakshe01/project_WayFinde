"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "../CSS/PlaceDetails.css"

const PlaceDetails = () => {
  const { placeId } = useParams()
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [wishlistAdded, setWishlistAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost:5030/api/places/${placeId}`)
      .then((res) => {
        setPlace(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch place details:", err)
        setError("Failed to load place details. Please try again later.")
        setLoading(false)
      })
  }, [placeId])

  const handleWishlistClick = () => {
    setWishlistAdded(!wishlistAdded)
    // Here you would typically make an API call to update the wishlist status
  }

  const handleImageClick = (index) => {
    setActiveImage(index)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading place details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    )
  }

  if (!place) return null

  return (
    <div className="place-details-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => window.history.back()}>
        ← Back
      </button>

      {/* Hero Image with Overlay Title */}
      <div className="hero-section">
        <img src={place.mainImageUrl || "/placeholder.svg"} alt={place.name} className="hero-image" />
        <div className="hero-overlay">
          <h1 className="hero-title">{place.name}</h1>
          <p className="hero-subtitle">{place.address}</p>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Wishlist Button */}
        <div className="wishlist-container">
          <button className={`wishlist-button ${wishlistAdded ? "added" : ""}`} onClick={handleWishlistClick}>
            {wishlistAdded ? "✓ Added to Wishlist" : "+ Add to Wishlist"}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Left Column - Description and History */}
          <div className="left-column">
            <div className="section description-section">
              <h2 className="section-title">About this place</h2>
              <p>{place.description}</p>
            </div>

            {place.history && (
              <div className="section history-section">
                <h2 className="section-title">History</h2>
                <p>{place.history}</p>
              </div>
            )}
          </div>

          {/* Right Column - Gallery and Info Cards */}
          <div className="right-column">
            {/* Featured Image */}
            <div className="featured-image-container">
              <img
                src={place.galleryImages?.[activeImage] || place.mainImageUrl}
                alt={`Featured view of ${place.name}`}
                className="featured-image"
              />
            </div>

            {/* Gallery of Small Images */}
            {place.galleryImages?.length > 0 && (
              <div className="gallery-section">
                {place.galleryImages.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                    className={`gallery-image ${activeImage === index ? "active" : ""}`}
                    onClick={() => handleImageClick(index)}
                  />
                ))}
              </div>
            )}

            {/* Info Cards */}
            <div className="info-cards">
              <div className="info-card">
                <h3>🕒 Opening Hours</h3>
                <p>{place.openingHours}</p>
              </div>
              <div className="info-card">
                <h3>📍 Address</h3>
                <p>{place.address}</p>
              </div>
              <div className="info-card">
                <h3>🔗 Directions</h3>
                <a href={place.googleMapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceDetails
