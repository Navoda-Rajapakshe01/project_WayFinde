// src/components/VehicleForm.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Components/Authentication/AuthContext/AuthContext";
import "../CSS/VehicleSupplier.css";

const initialState = {
  brand: "",
  model: "",
  pricePerDay: "",
  location: "",
  images: [],
  type: "",
  numberOfPassengers: "",
  fuelType: "",
  transmissionType: "",
  amenities: [],
  supplierId: "",
  supplierName: "", // ✅ added
  districtId: "",
  placeId: "",
};

const AMENITY_OPTIONS = [
  "Air Conditioning",
  "GPS Navigation",
  "Bluetooth Connectivity",
  "USB Charging Ports",
  "Child Seat",
  "Sunroof",
  "Leather Seats",
  "Roof Rack",
  "Reverse Camera",
  "Parking Sensors",
  "Dash Cam",
  "First Aid Kit",
  "Extra Luggage Space",
  "Cool Box / Mini Fridge",
];

const VEHICLE_TYPE_MAX_CAPACITY = {
  Motorcycle: 2,
  TukTuk: 3,
  Hatchback: 4,
  Sedan: 5,
  SUV: 7,
  Van: 10,
  Commuter: 15,
};

const VehicleForm = ({ onClose, onSuccess, onFail }) => {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [maxSeats, setMaxSeats] = useState(20);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [districtRes, placesRes] = await Promise.all([
          axios.get("http://localhost:5030/api/District"),
          axios.get("http://localhost:5030/api/places"),
        ]);

        // Extract the $values arrays from the response data
        setDistricts(districtRes.data?.$values || []);
        setPlaces(placesRes.data?.$values || []);

        console.log("Metadata loaded:", {
          districts: districtRes.data,
          places: placesRes.data,
        });
      } catch (err) {
        console.error("Error loading metadata:", err);
      }
    };

    loadMetadata();

    if (user?.id && user?.username) {
      setForm((prev) => ({
        ...prev,
        supplierId: user.id,
        supplierName: user.username, // ✅ set supplierName
      }));
    }
    console.log("AuthContext user:", user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      const max = VEHICLE_TYPE_MAX_CAPACITY[value] || 20;
      setMaxSeats(max);
      setForm((prev) => ({
        ...prev,
        type: value,
        numberOfPassengers:
          prev.numberOfPassengers > max
            ? max.toString()
            : prev.numberOfPassengers,
      }));
    } else if (name === "numberOfPassengers") {
      const clamped = Math.min(Number(value), maxSeats);
      setForm({ ...form, [name]: clamped.toString() });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can upload up to 5 images only.");
      return;
    }
    setForm({ ...form, images: files });
  };

  const handleAmenityToggle = (value, checked) => {
    setForm((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value),
    }));
  };

  const validate = () => {
    const f = form;
    if (!f.brand) return "Brand is required";
    if (!f.model) return "Model is required";
    if (!f.pricePerDay) return "Price is required";
    if (!f.location) return "Location is required";
    if (!f.type) return "Vehicle type is required";
    if (!f.numberOfPassengers) return "Capacity is required";
    if (!f.fuelType) return "Fuel type is required";
    if (!f.transmissionType) return "Transmission type is required";
    if (!f.districtId) return "District is required";
    if (!f.placeId) return "Place to visit is required";
    return null;
  };

  const handleSubmit = async () => {
    console.log("Submitting vehicle with form data:", form, user);
    const error = validate();
    if (error) {
      alert(error);
      console.log("Submitting vehicle with supplierId:", form.supplierId);
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("Brand", form.brand);
    data.append("Model", form.model);
    data.append("PricePerDay", form.pricePerDay);
    data.append("Location", form.location);
    data.append("Type", form.type);
    data.append("NumberOfPassengers", form.numberOfPassengers);
    data.append("FuelType", form.fuelType);
    data.append("TransmissionType", form.transmissionType);
    data.append("SupplierId", form.supplierId);
    data.append("SupplierName", form.supplierName); // ✅ send supplier name
    data.append("DistrictId", form.districtId);
    data.append("PlaceId", form.placeId);

    form.amenities.forEach((a) => data.append("Amenities", a));
    form.images.forEach((img) => data.append("Images", img));

    try {
      await axios.post("http://localhost:5030/api/vehicle", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Vehicle posted successfully!");
      setForm(initialState);
      setMaxSeats(20);
      onSuccess();
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      alert("Submission failed. Check console for details.");
      onFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="vehicle-form">
        <h2>Post New Vehicle</h2>

        <div className="form-toggle-buttons">
          <button
            className={`toggle-btn ${!preview ? "active" : ""}`}
            onClick={() => setPreview(false)}>
            Form
          </button>
          <button
            className={`toggle-btn ${preview ? "active" : ""}`}
            onClick={() => setPreview(true)}
            disabled={!form.brand}>
            Preview
          </button>
        </div>

        {!preview ? (
          <>
            <div className="form-fields">
              {/* BRAND & MODEL */}
              <div className="form-row">
                <div className="form-group">
                  <label>Brand*</label>
                  <input
                    name="brand"
                    type="text"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="e.g. Toyota"
                  />
                </div>
                <div className="form-group">
                  <label>Model*</label>
                  <input
                    name="model"
                    type="text"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="e.g. Corolla"
                  />
                </div>
              </div>

              {/* PRICE & LOCATION */}
              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Day (Rs/day)*</label>
                  <input
                    name="pricePerDay"
                    type="number"
                    value={form.pricePerDay}
                    onChange={handleChange}
                    placeholder="e.g. 7500"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Location*</label>
                  <input
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Colombo"
                  />
                </div>
              </div>

              {/* TYPE & SEATS */}
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Type*</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    {Object.keys(VEHICLE_TYPE_MAX_CAPACITY).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacity (seats)*</label>
                  <input
                    name="numberOfPassengers"
                    type="number"
                    value={form.numberOfPassengers}
                    onChange={handleChange}
                    placeholder={`1 - ${maxSeats}`}
                    min="1"
                    max={maxSeats}
                  />
                </div>
              </div>

              {/* FUEL & TRANSMISSION */}
              <div className="form-row">
                <div className="form-group">
                  <label>Fuel Type*</label>
                  <select
                    name="fuelType"
                    value={form.fuelType}
                    onChange={handleChange}>
                    <option value="">Select Fuel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Transmission*</label>
                  <select
                    name="transmissionType"
                    value={form.transmissionType}
                    onChange={handleChange}>
                    <option value="">Select Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Triptonic">Triptonic</option>
                  </select>
                </div>
              </div>

              {/* DISTRICT & PLACE */}
              <div className="form-row">
                <div className="form-group">
                  <label>District*</label>
                  <select
                    name="districtId"
                    value={form.districtId}
                    onChange={handleChange}
                    required>
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {String(d.id).padStart(2, "0")} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Service Area*</label>
                  <select
                    name="placeId"
                    value={form.placeId}
                    onChange={handleChange}
                    required>
                    <option value="">Select Area</option>
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {String(p.id).padStart(2, "0")} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* IMAGES */}
              <div className="form-group">
                <label>Vehicle Images (max 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {form.images.length > 0 && (
                  <div className="image-preview-container">
                    {form.images.map((img, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${index}`}
                        className="image-preview"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* AMENITIES */}
              <div className="form-group">
                <label>Amenities</label>
                <div className="checkbox-group">
                  {AMENITY_OPTIONS.map((a) => (
                    <label key={a} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={a}
                        checked={form.amenities.includes(a)}
                        onChange={(e) =>
                          handleAmenityToggle(a, e.target.checked)
                        }
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="form-actions">
                <button className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="preview-card">
            <h3>Preview</h3>
            <div className="preview-content">
              <div className="preview-image">
                {form.images.length > 0 ? (
                  <img
                    src={URL.createObjectURL(form.images[0])}
                    alt="Vehicle Preview"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="preview-details">
                <h4>
                  {form.brand} {form.model}
                </h4>
                <p className="preview-price">Rs{form.pricePerDay}/day</p>
                <p className="preview-location">{form.location}</p>
                <p className="preview-specs">
                  {form.type} - {form.numberOfPassengers} seats -{" "}
                  {form.fuelType}, {form.transmissionType}
                </p>
                <div className="preview-amenities">
                  {form.amenities.map((a, i) => (
                    <span key={i} className="amenity-tag">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleForm;
