// src/components/AccommodationForm.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Components/Authentication/AuthContext/AuthContext";
import "../CSS/VehicleSupplier.css"; // ✅ Using same styles for consistency

const initialState = {
  name: "",
  type: "",
  location: "",
  pricePerNight: "",
  bedrooms: 1,
  bathrooms: 1,
  maxGuests: 1,
  description: "",
  amenities: [],
  images: [],
  districtId: "",
  placeId: "",
  supplierId: "",
  supplierName: "",
};

const AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Kitchen",
  "TV",
  "Washing Machine",
  "Free Parking",
  "Pool",
  "Hot Tub",
  "Gym",
  "Breakfast",
  "Beach Access",
  "Mountain View",
  "Pets Allowed",
  "Balcony",
  "Garden",
];

const AccommodationForm = ({ onClose, onSuccess, onFail }) => {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [districtRes, placeRes] = await Promise.all([
          axios.get("http://localhost:5030/api/district"),
          axios.get("http://localhost:5030/api/places"),
        ]);

        // Handle .NET style response wrapped in $values array
        const distData = Array.isArray(districtRes.data)
          ? districtRes.data
          : districtRes.data?.$values || [];
        const placeData = Array.isArray(placeRes.data)
          ? placeRes.data
          : placeRes.data?.$values || [];

        setDistricts(distData);
        setPlaces(placeData);
      } catch (err) {
        console.error("Failed to load metadata", err);
        setDistricts([]);
        setPlaces([]);
      }
    };

    fetchMetadata();

    if (user?.id && user?.username) {
      setForm((prev) => ({
        ...prev,
        supplierId: user.id,
        supplierName: user.username,
      }));
    }
  }, [user]);

  // Manage cleanup of image preview URLs to avoid memory leaks
  useEffect(() => {
    // Revoke URLs on cleanup
    return () => {
      form.images.forEach((img) => URL.revokeObjectURL(img));
    };
  }, [form.images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Max 5 images allowed.");
      return;
    }
    setForm((prev) => ({ ...prev, images: files }));
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
    if (!f.name) return "Name is required";
    if (!f.type) return "Accommodation type is required";
    if (!f.location) return "Location is required";
    if (!f.pricePerNight) return "Price per night is required";
    if (!f.bedrooms) return "Bedrooms required";
    if (!f.bathrooms) return "Bathrooms required";
    if (!f.maxGuests) return "Max guests required";
    if (!f.districtId) return "District is required";
    if (!f.placeId) return "Service area is required";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return alert(error);

    const data = new FormData();
    data.append("Name", form.name);
    data.append("Type", form.type);
    data.append("Location", form.location);
    data.append("PricePerNight", form.pricePerNight);
    data.append("Bedrooms", form.bedrooms);
    data.append("Bathrooms", form.bathrooms);
    data.append("MaxGuests", form.maxGuests);
    data.append("Description", form.description);
    data.append("DistrictId", form.districtId);
    data.append("PlaceId", form.placeId);
    data.append("SupplierId", form.supplierId);
    data.append("SupplierName", form.supplierName);
    form.amenities.forEach((a) => data.append("Amenities", a));
    form.images.forEach((img) => data.append("Images", img));

    try {
      setLoading(true);
      await axios.post("http://localhost:5030/api/Accommodation", data);
      alert("Accommodation posted successfully!");
      setForm(initialState);
      onSuccess();
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
      alert("Submission failed.");
      onFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-form">
      <h2>Post New Accommodation</h2>

      <div className="form-toggle-buttons">
        <button
          className={`toggle-btn ${!preview ? "active" : ""}`}
          onClick={() => setPreview(false)}>
          Form
        </button>
        <button
          className={`toggle-btn ${preview ? "active" : ""}`}
          onClick={() => setPreview(true)}
          disabled={!form.name}>
          Preview
        </button>
      </div>

      {!preview ? (
        <div className="form-fields">
          {/* Row 1: Name + Type */}
          <div className="form-row">
            <div className="form-group">
              <label>Name*</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Type*</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">Select Type</option>
                {[
                  "Hotel",
                  "Apartment",
                  "Villa",
                  "Cottage",
                  "Homestay",
                  "Cabin",
                  "Bungalow",
                  "Resort",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: District + Place */}
          <div className="form-row">
            <div className="form-group">
              <label>District*</label>
              <select
                name="districtId"
                value={form.districtId}
                onChange={handleChange}>
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Service Area*</label>
              <select
                name="placeId"
                value={form.placeId}
                onChange={handleChange}>
                <option value="">Select Area</option>
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Location + Price */}
          <div className="form-row">
            <div className="form-group">
              <label>Address*</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Price Per Night*</label>
              <input
                name="pricePerNight"
                type="number"
                value={form.pricePerNight}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 4: Bedrooms + Bathrooms + MaxGuests */}
          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms*</label>
              <input
                name="bedrooms"
                type="number"
                min={1}
                value={form.bedrooms}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Bathrooms*</label>
              <input
                name="bathrooms"
                type="number"
                min={1}
                value={form.bathrooms}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Max Guests*</label>
              <input
                name="maxGuests"
                type="number"
                min={1}
                value={form.maxGuests}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Images */}
          <div className="form-group">
            <label>Accommodation Images (up to 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="image-preview-container">
              {form.images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${i}`}
                  className="image-preview"
                />
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="form-group">
            <label>Amenities</label>
            <div className="checkbox-group">
              {AMENITIES.map((a) => (
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

          {/* Actions */}
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
        // Preview Section
        <div className="preview-card">
          <h3>Preview</h3>
          <div className="preview-content">
            <div className="preview-image">
              {form.images.length > 0 ? (
                <img src={URL.createObjectURL(form.images[0])} alt="Preview" />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            <div className="preview-details">
              <h4>{form.name}</h4>
              <p>
                {form.type} in{" "}
                {districts.find((d) => d.id == form.districtId)?.name ||
                  "District"}
              </p>
              <p>{form.location}</p>
              <p>Rs {form.pricePerNight}/night</p>
              <p>
                {form.bedrooms} bedrooms • {form.bathrooms} bathrooms • Max{" "}
                {form.maxGuests} guests
              </p>
              {form.description && <p>{form.description}</p>}
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

export default AccommodationForm;
