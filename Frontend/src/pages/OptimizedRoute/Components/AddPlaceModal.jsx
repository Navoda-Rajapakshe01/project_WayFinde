import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "./AddPlaceModal.css";
import PlaceCard from "../../CreateTrip/Components/PlaceCard";

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

  // 🌟 New logic: Map categoryId to label
  const getLabelFromCategoryId = (id) => {
    switch (id) {
      case 4:
        return "Do";
      case 3:
      case 1:
        return "Relax";
      case 2:
        return "Stay";
      default:
        return "Other";
    }
  };

  const categorizedPlaces = {
    Do: [],
    Relax: [],
    Stay: [],
    Other: [],
  };

  filteredPlaces.forEach((place) => {
    const label = getLabelFromCategoryId(place.categoryId);
    categorizedPlaces[label]?.push(place);
  });

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
            {categorizedPlaces.Do.length > 0 && (
              <div className="places-section-adp">
                <h3 className="section-title-adp">Do</h3>
                <div className="places-grid-adp">
                  {categorizedPlaces.Do.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isSelected={existingPlaceIds.includes(place.id)}
                      onAddPlace={onAddPlace}
                    />
                  ))}
                </div>
              </div>
            )}
            {categorizedPlaces.Relax.length > 0 && (
              <div className="places-section-adp">
                <h3 className="section-title-adp">Relax</h3>
                <div className="places-grid-adp">
                  {categorizedPlaces.Relax.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onAddPlace={onAddPlace}
                    />
                  ))}
                </div>
              </div>
            )}
            {categorizedPlaces.Stay.length > 0 && (
              <div className="places-section-adp">
                <h3 className="section-title-adp">Stay</h3>
                <div className="places-grid-adp">
                  {categorizedPlaces.Stay.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onAddPlace={onAddPlace}
                    />
                  ))}
                </div>
              </div>
            )}
            {categorizedPlaces.Other.length > 0 && (
              <div className="places-section-adp">
                <h3 className="section-title-adp">Other Places</h3>
                <div className="places-grid-adp">
                  {categorizedPlaces.Other.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isSelected={existingPlaceIds.includes(place.id)}
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

export default AddPlaceModal;
