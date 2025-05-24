import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/VehicleSupplier.css";

const initialState = {
  brand: "",
  model: "",
  PricePerDay: "",
  location: "",
  images: [],
  type: "",
  NumberOfPassengers: "",
  FuelType: "",
  transmissionType: "",
  amenities: [],
  supplierId: "", // will be set from localStorage or login info
};

const AMENITY_OPTIONS = [
  "Air Conditioning",
  "GPS",
  "Bluetooth",
  "Child Seat",
  "Sunroof",
  "Leather Seats",
  "USB Charging",
  "Roof Rack",
];

const VehicleForm = ({ onClose, onSuccess, onFail }) => {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSupplierId = localStorage.getItem("supplierId");
    if (savedSupplierId) {
      setForm((prev) => ({ ...prev, supplierId: savedSupplierId }));
    } else {
      setForm((prev) => ({
        ...prev,
        supplierId: "123e4567-e89b-12d3-a456-426614174000", // Dummy for development
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can upload up to 5 images only.");
      return;
    }
    setForm({ ...form, images: files });
  };

  const handleAmenityToggle = (value, isChecked) => {
    setForm((prev) => ({
      ...prev,
      amenities: isChecked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value),
    }));
  };

  const isValidGuid = (guid) => {
    const guidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return guidRegex.test(guid);
  };

  const validate = () => {
    if (!form.brand) return "Brand is required";
    if (!form.model) return "Model is required";
    if (!form.PricePerDay) return "Price is required";
    if (!form.location) return "Location is required";
    if (!form.type) return "Vehicle type is required";
    if (!form.NumberOfPassengers) return "Capacity is required";
    if (!form.FuelType) return "Fuel type is required";
    if (!form.transmissionType) return "Transmission type is required";
    if (
      !form.supplierId ||
      (!isValidGuid(form.supplierId) && isNaN(parseInt(form.supplierId)))
    ) {
      return "Invalid supplier ID. Please log in again.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("Brand", form.brand);
    formData.append("Model", form.model);
    formData.append("PricePerDay", parseFloat(form.PricePerDay).toString());
    formData.append("Location", form.location);
    formData.append("Type", form.type);
    formData.append("NumberOfPassengers", form.NumberOfPassengers);
    formData.append("FuelType", form.FuelType);
    formData.append("transmissionType", form.transmissionType);
    formData.append("SupplierId", form.supplierId);

    form.amenities.forEach((a) => formData.append("Amenities", a));
    form.images.forEach((img) => formData.append("Images", img));

    try {
      await axios.post("http://localhost:5030/api/vehicle", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Vehicle posted successfully!");
      setForm(initialState);
      onSuccess();
    } catch (error) {
      console.error("Submission error:", error.response || error.message);
      onFail();
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="form-fields">
          {/* Brand & Model */}
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

          {/* Price & Location */}
          <div className="form-row">
            <div className="form-group">
              <label>Price Per Day (Rs/day)*</label>
              <input
                name="PricePerDay"
                type="number"
                value={form.PricePerDay}
                onChange={handleChange}
                placeholder="e.g. 7,500"
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

          {/* Type & Capacity */}
          <div className="form-row">
            <div className="form-group">
              <label>Vehicle Type*</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Van">Van</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Minibus">Minibus</option>
              </select>
            </div>
            <div className="form-group">
              <label>Capacity (seats)*</label>
              <input
                name="NumberOfPassengers"
                type="number"
                value={form.NumberOfPassengers}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="1"
                max="20"
              />
            </div>
          </div>

          {/* Fuel & Transmission */}
          <div className="form-row">
            <div className="form-group">
              <label>Fuel Type*</label>
              <select
                name="FuelType"
                value={form.FuelType}
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

          {/* Image Upload */}
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

          {/* Amenities */}
          <div className="form-group">
            <label>Amenities</label>
            <div className="checkbox-group">
              {AMENITY_OPTIONS.map((a) => (
                <label key={a} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={a}
                    checked={form.amenities.includes(a)}
                    onChange={(e) => handleAmenityToggle(a, e.target.checked)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
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
              <p className="preview-price">Rs{form.PricePerDay}/day</p>
              <p className="preview-location">{form.location}</p>
              <p className="preview-specs">
                {form.type} - {form.NumberOfPassengers} seats - {form.FuelType},{" "}
                {form.transmissionType}
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
  );
};

export default VehicleForm;
