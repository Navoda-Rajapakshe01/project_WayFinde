import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Search, Plus } from "lucide-react";
import "./AddPlaceModal.css";

const AddPlaceModal = ({ onAddPlace, onClose, existingPlaceIds = [] }) => {
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const districtsResponse = await axios.get(
          "http://localhost:5030/api/district/getAll"
        );
        setDistricts(districtsResponse.data || []);

        const placesResponse = await axios.get(
          "http://localhost:5030/api/places/getAll"
        );
        setPlaces(placesResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = places;
    if (selectedDistrict) {
      filtered = filtered.filter(
        (place) =>
          place.district?.name === selectedDistrict.name ||
          place.district === selectedDistrict.id
      );
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((place) =>
        (place.name || place.name || "").toLowerCase().includes(query)
      );
    }
    filtered = filtered.filter((place) => !existingPlaceIds.includes(place.id));
    setFilteredPlaces(filtered);
  }, [selectedDistrict, searchQuery, places, existingPlaceIds]);

  const handleDistrictSelect = (district) => setSelectedDistrict(district);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const doPlaces = filteredPlaces.filter((place) => place.placeType === "Do");
  const relaxPlaces = filteredPlaces.filter(
    (place) => place.placeType === "Relax"
  );
  const stayPlaces = filteredPlaces.filter(
    (place) => place.placeType === "Stay"
  );
  const otherPlaces = filteredPlaces.filter(
    (place) =>
      !place.placeType || !["Do", "Relax", "Stay"].includes(place.placeType)
  );

  return (
    <div className="modal-overlay-adp">
      <div className="add-place-modal-adp">
        <div className="modal-header-adp">
          <h2 className="modal-title-adp">Add More Places to Your Trip</h2>
          <button className="modal-close-adp" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-search-adp">
          <div className="search-container-adp">
            <input
              type="text"
              placeholder="Search for places..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input-adp"
            />
          </div>
        </div>

        <div className="districts-selector-adp">
          <h3 className="section-title-adp">Select District</h3>
          <div className="districts-grid-adp">
            {districts.map((district) => (
              <div
                key={district.id}
                className={`district-chip-adp ${
                  selectedDistrict?.id === district.id ? "selected-adp" : ""
                }`}
                onClick={() => handleDistrictSelect(district)}
              >
                {district.name}
              </div>
            ))}
            {selectedDistrict && (
              <div
                className="district-chip-adp clear-adp"
                onClick={() => setSelectedDistrict(null)}
              >
                Clear Selection
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-container-adp">
            <div className="loading-spinner-adp"></div>
            <p>Loading places...</p>
          </div>
        ) : (
          <div className="places-container-adp">
            {doPlaces.length > 0 && (
              <div className="places-section-adp">
                <h3 className="section-title-adp">Do</h3>
                <div className="places-grid-adp">
                  {doPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onAddPlace={onAddPlace}
                    />
                  ))}
                </div>
              </div>
            )}
            {relaxPlaces.length > 0 && (
              <div className="places-section-adp">
                <h3 className="section-title-adp">Relax</h3>
                <div className="places-grid-adp">
                  {relaxPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onAddPlace={onAddPlace}
                    />
                  ))}
                </div>
              </div>
            )}
            {stayPlaces.length > 0 && (
              <div className="places-section-adp">
                <h3 className="section-title-adp">Stay</h3>
                <div className="places-grid-adp">
                  {stayPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onAddPlace={onAddPlace}
                    />
                  ))}
                </div>
              </div>
            )}
            {otherPlaces.length > 0 && (
              <div className="places-section-adp">
                <h3 className="section-title-adp">Other Places</h3>
                <div className="places-grid-adp">
                  {otherPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onAddPlace={onAddPlace}
                    />
                  ))}
                </div>
              </div>
            )}
            {filteredPlaces.length === 0 && (
              <div className="no-places-message-adp">
                <p>
                  No places found. Try changing your search or district
                  selection.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PlaceCard = ({ place, onAddPlace }) => {
  const displayName = place.name || place.name || "Unnamed Place";
  const defaultImage = `/placeholder.svg?height=200&width=300&query=${displayName} Sri Lanka`;

  return (
    <div className="modal-place-card-adp">
      <div className="place-image-container-adp">
        <img
          src={place.mainImageUrl || defaultImage}
          alt={displayName}
          className="place-image-adp"
        />
        <button
          className="add-button-adp"
          onClick={() => onAddPlace(place)}
          aria-label={`Add ${displayName}`}
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="place-info-adp">
        <h3 className="place-name-adp">{displayName}</h3>
        <div className="place-rating-adp">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star-adp ${
                star <= Math.round(place.rating || 4) ? "filled-adp" : ""
              }`}
            >
              ★
            </span>
          ))}
          <span className="rating-count-adp">count</span>
        </div>
        <div className="place-details-adp">
          <div className="detail-adp">
            <span className="detail-label-adp">Duration:</span>
            <span className="detail-value-adp">{place.avgTime || "N/A"}</span>
          </div>
          <div className="detail-adp">
            <span className="detail-label-adp">Avg. Spend:</span>
            <span className="detail-value-adp">
              {place.avgSpend ? `Rs. ${place.avgSpend}` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlaceModal;
