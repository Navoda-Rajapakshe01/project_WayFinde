import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Check } from "lucide-react";
import { v4 as uuid } from "uuid";

import PlaceItem from "./components/PlaceItem";
import TripSummaryCard from "./components/TripSummaryCard";
import OptimizedMap from "./components/OptimizedMap";
import AddPlaceModal from "./components/AddPlaceModal";
import "./OptimizedRoute.css";

const OptimizedRoute = () => {
  /* ──────────────────────────── state ─────────────────────────── */
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPlaceModal, toggleAdd] = useState(false);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [routePolyline, setRoutePolyline] = useState([]);
  const [successMessage, setSuccess] = useState("");

  const timerRef = useRef(null); // holds success/error timer id

  /* ─────────────────────── fetch trip once ────────────────────── */
  useEffect(() => {
    let isCancelled = false;
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          "http://localhost:5203/api/trips/getTripById",
          { tripId: id }
        );
        if (!isCancelled && data) {
          setTrip(data);
          setPlaces(
            (data.places || []).map((p) => ({ ...p, id: p.id ?? uuid() }))
          );
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Error fetching trip data:", err);
          setError("Failed to load trip data. Please try again.");
        }
      } finally {
        !isCancelled && setLoading(false);
      }
    };

    if (id) fetchTripData();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  /* ─────────────── build markers + polyline on change ─────────── */
  useEffect(() => {
    if (places.length === 0) {
      setMapMarkers([]);
      setRoutePolyline([]);
      return;
    }

    const markers = places.map((place, idx) => {
      const position = extractCoordinates(place?.googleUrl);
      return {
        id: place.id,
        position,
        title: place.placeName || place.name || "Unnamed Place",
        order: idx + 1,
      };
    });

    setMapMarkers(markers);
    setRoutePolyline(markers.map((m) => m.position));
  }, [places]);

  /* ───────────────────── helpers / callbacks ──────────────────── */
  const extractCoordinates = (url = "") => {
    const m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m && m.length === 3) return { lat: +m[1], lng: +m[2] };

    // fallback: small random jitter near SL
    return {
      lat: 6.0329 + Math.random() * 0.05,
      lng: 80.2168 + Math.random() * 0.05,
    };
  };

  const movePlace = useCallback((dragIdx, hoverIdx) => {
    setPlaces((prev) => {
      const updated = [...prev];
      const [dragged] = updated.splice(dragIdx, 1);
      updated.splice(hoverIdx, 0, dragged);
      return updated;
    });
  }, []);

  const removePlace = useCallback((placeId) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
  }, []);

  const addPlace = useCallback((newPlace) => {
    toggleAdd(false);
    setPlaces((prev) => [...prev, { ...newPlace, id: newPlace.id ?? uuid() }]);
  }, []);

  const tripDetails = useMemo(() => {
    if (!trip) return { days: 0, destinations: 0, distance: 0 };
    const diff =
      Math.ceil(
        (new Date(trip.endDate) - new Date(trip.startDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return {
      days: diff,
      destinations: places.length,
      distance: trip.tripDistance ?? 0,
    };
  }, [trip, places.length]);

  /* ─────────────────────── update on server ───────────────────── */
  const updateTrip = async () => {
    console.log("Updating trip with TripId:", id);
    console.log(
      "Place IDs:",
      places.map((p) => p.id)
    );
    try {
      await axios.put("http://localhost:5203/api/trips/update-trip", {
        TripId: id,
        PlaceIds: places.map((p) => p.id),
      });
      flashMessage(setSuccess, "Trip updated successfully!");
    } catch (err) {
      console.error("Error updating trip:", err);
      flashMessage(setError, "Failed to update trip. Please try again.");
    }
  };

  /* util: show msg + clear previous timer */
  const flashMessage = (setter, msg) => {
    setter(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setter(""), 3000);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  /* ────────────────────────── early UI ────────────────────────── */
  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading trip details...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
        <button className="back-button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <div className="optimized-route-container">
      <header className="optimized-route-header">
        <h1 className="optimized-route-title">
          Optimized Route for Your Journey
        </h1>
        <p className="optimized-route-subtitle">
          Your destinations are arranged into the shortest, most efficient path.
          You can drag to reorder or add more stops anytime.
        </p>
      </header>

      <div className="optimized-route-content">
        {/* LEFT — draggable list */}
        <DndProvider backend={HTML5Backend}>
          <aside className="optimized-route-left">
            <div className="places-list-optimized">
              {places.map((place, idx) => (
                <PlaceItem
                  key={place.id}
                  place={place}
                  index={idx}
                  order={idx + 1}
                  movePlace={movePlace}
                  removePlace={removePlace}
                />
              ))}
            </div>
          </aside>
        </DndProvider>

        {/* RIGHT — summary, map, actions */}
        <section className="optimized-route-right">
          <div className="trip-summary-cards">
            <TripSummaryCard
              title="Travel Days"
              value={`${tripDetails.days} Days`}
              icon="calendar"
            />
            <TripSummaryCard
              title="Destinations"
              value={tripDetails.destinations}
              icon="map-pin"
            />
            <TripSummaryCard
              title="Distance"
              value={`${tripDetails.distance} km`}
              icon="navigation"
            />
          </div>

          <div className="map-container">
            <OptimizedMap markers={mapMarkers} polyline={routePolyline} />
          </div>

          <div className="action-buttons">
            <button
              className="add-places-button"
              onClick={() => toggleAdd(true)}
            >
              <Plus size={20} /> Add More Places
            </button>
            <button className="complete-trip-button" onClick={updateTrip}>
              <Check size={20} /> Complete Trip
            </button>
          </div>
        </section>
      </div>

      {/* modal & toast */}
      {showAddPlaceModal && (
        <AddPlaceModal
          onAddPlace={addPlace}
          onClose={() => toggleAdd(false)}
          existingPlaceIds={places.map((p) => p.id)}
        />
      )}

      {successMessage && (
        <div className="success-message">
          <div className="success-content">
            <span className="success-icon">✓</span>
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedRoute;
