import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/AccommodationSupplier.css";

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
};

const AccommodationForm = ({ onClose, onSuccess, onFail }) => {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5030/api/district")
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error("Failed to load districts", err));
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

  const validate = () => {
    if (!form.name) return "Name is required";
    if (!form.type) return "Accommodation type is required";
    if (!form.location) return "Location is required";
    if (!form.pricePerNight) return "Price per night is required";
    if (!form.bedrooms) return "Number of bedrooms is required";
    if (!form.bathrooms) return "Number of bathrooms is required";
    if (!form.maxGuests) return "Maximum number of guests is required";
    if (!form.districtId) return "District is required";
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

    formData.append("Name", form.name);
    formData.append("Type", form.type);
    formData.append("Location", form.location);
    formData.append("PricePerNight", parseFloat(form.pricePerNight));
    formData.append("Bedrooms", parseInt(form.bedrooms));
    formData.append("Bathrooms", parseFloat(form.bathrooms));
    formData.append("MaxGuests", parseInt(form.maxGuests));
    formData.append("Description", form.description);
    formData.append("DistrictId", form.districtId);

    form.amenities.forEach((a) => formData.append("Amenities", a));
    form.images.forEach((img) => formData.append("Images", img));

    try {
      await axios.post("http://localhost:5030/api/accommodation", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm(initialState);
      setLoading(false);
      setPreview(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      setLoading(false);
      onFail();
    }
  };

  const accommodationTypes = [
    "Hotel",
    "Apartment",
    "Villa",
    "Cottage",
    "Homestay",
    "Cabin",
    "Bungalow",
    "Resort",
  ];

  const availableAmenities = [
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

  return (
    <div className="accommodation-form">
      <h2>Post New Accommodation</h2>

      {/* Preview toggle buttons */}
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
        // Form View
        <div className="form-fields">
          <div className="form-group">
            <label>Name*</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Type*</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="">Select Type</option>
              {accommodationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>District*</label>
            <select
              name="districtId"
              value={form.districtId}
              onChange={handleChange}>
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Address*</label>
            <input
              name="location"
              type="text"
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

          <div className="form-group">
            <label>Bedrooms*</label>
            <input
              name="bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Bathrooms*</label>
            <input
              name="bathrooms"
              type="number"
              value={form.bathrooms}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Max Guests*</label>
            <input
              name="maxGuests"
              type="number"
              value={form.maxGuests}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Images</label>
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

          <div className="form-group">
            <label>Amenities</label>
            <div className="checkbox-group">
              {availableAmenities.map((a) => (
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

          <div className="form-actions">
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      ) : (
        // Preview View
        <div className="preview-card">
          <h3>Preview</h3>
          <div className="preview-content">
            <div className="preview-image">
              {form.images.length > 0 ? (
                <img
                  src={URL.createObjectURL(form.images[0])}
                  alt="Accommodation Preview"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            <div className="preview-details">
              <h4>{form.name}</h4>
              <p className="preview-type-location">
                <span className="preview-type">{form.type}</span> in{" "}
                <span className="preview-location">
                  {districts.find((d) => d.id === parseInt(form.districtId))
                    ?.name || "District"}
                </span>
              </p>
              <p className="preview-location">{form.location}</p>
              <p className="preview-price">${form.pricePerNight}/night</p>
              <p className="preview-specs">
                {form.bedrooms} {form.bedrooms === 1 ? "bedroom" : "bedrooms"} •{" "}
                {form.bathrooms}{" "}
                {form.bathrooms === 1 ? "bathroom" : "bathrooms"} • Max{" "}
                {form.maxGuests} {form.maxGuests === 1 ? "guest" : "guests"}
              </p>
              {form.description && (
                <p className="preview-description">{form.description}</p>
              )}
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
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationForm;
