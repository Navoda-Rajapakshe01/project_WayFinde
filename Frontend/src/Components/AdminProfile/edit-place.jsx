import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./edit-place.css";
import "../../App.css";

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [placeData, setPlaceData] = useState({
    name: "",
    description: "",
    history: "",
    openingHours: "",
    address: "",
    googleMapLink: "",
    mainImageUrl: "",
    districtId: "",
    categoryId: "",
  });

  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const placePromise = axios.get(
          `http://localhost:5030/api/places/${id}`
        );
        const districtsPromise = axios.get(
          "http://localhost:5030/api/district"
        );
        const categoriesPromise = axios.get(
          "http://localhost:5030/api/places/categories"
        );

        const [placeResponse, districtsResponse, categoriesResponse] =
          await Promise.all([
            placePromise,
            districtsPromise,
            categoriesPromise,
          ]);

        const fetchedPlace = placeResponse.data;
        setPlaceData({
          name: fetchedPlace.name || "",
          description: fetchedPlace.description || "",
          history: fetchedPlace.history || "",
          openingHours: fetchedPlace.openingHours || "",
          address: fetchedPlace.address || "",
          googleMapLink: fetchedPlace.googleMapLink || "",
          mainImageUrl: fetchedPlace.mainImageUrl || "",
          districtId: fetchedPlace.districtId || "",
          categoryId: fetchedPlace.categoryId || "",
        });
        setDistricts(Array.isArray(districtsResponse.data?.$values) ? districtsResponse.data.$values : []);
        setCategories(Array.isArray(categoriesResponse.data?.$values) ? categoriesResponse.data.$values : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error!", "Could not load data for editing.", "error");
        navigate("/admin/places-management");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaceData({ ...placeData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic Validation
    if (
      !placeData.name ||
      !placeData.mainImageUrl ||
      !placeData.description ||
      !placeData.districtId ||
      !placeData.categoryId
    ) {
      Swal.fire(
        "Validation Error",
        "Please fill in all required fields (Name, Image URL, Description, District, Category).",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...placeData,
      districtId: parseInt(placeData.districtId, 10),
      categoryId: parseInt(placeData.categoryId, 10),
    };

    try {
      await axios.patch(`http://localhost:5030/api/places/${id}`, payload);
      Swal.fire({
        title: "Success!",
        text: "Place updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/admin/places-management");
    } catch (error) {
      console.error(
        "Error updating place:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error!",
        `Failed to update place. ${error.response?.data?.message || ""}`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-content" style={{ padding: "20px" }}>
        {" "}
        <div className="adminsection-loading">
          <div className="adminloading-spinner"></div>
          <p>Loading place details...</p>
        </div>
      </div>
    );
  }

  const requiredLabel = <span className="required-asterisk">*</span>;

  return (
    <div className="ep-admin-content">
      <div className="ep-page-title">
        Edit Place: {placeData.name || "Loading..."}
      </div>
      <div className="ep-form-container-card">
        <form onSubmit={handleUpdate} className="ep-form">
          <div className="ep-form-group">
            <label htmlFor="name">Name {requiredLabel}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={placeData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ep-form-group">
            <label htmlFor="description">Description {requiredLabel}</label>
            <textarea
              id="description"
              name="description"
              value={placeData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="ep-form-group">
            <label htmlFor="history">History</label>
            <textarea
              id="history"
              name="history"
              value={placeData.history}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="ep-form-row">
            <div className="ep-form-group">
              <label htmlFor="openingHours">Opening Hours</label>
              <input
                type="text"
                id="openingHours"
                name="openingHours"
                value={placeData.openingHours}
                onChange={handleChange}
                placeholder="e.g., 9 AM - 5 PM"
              />
            </div>
          </div>

          <div className="ep-form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={placeData.address}
              onChange={handleChange}
            />
          </div>

          <div className="ep-form-group">
            <label htmlFor="googleMapLink">Google Map Link</label>
            <input
              type="url"
              id="googleMapLink"
              name="googleMapLink"
              value={placeData.googleMapLink}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="ep-form-group">
            <label htmlFor="mainImageUrl">Main Image URL {requiredLabel}</label>
            <input
              type="url"
              id="mainImageUrl"
              name="mainImageUrl"
              value={placeData.mainImageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="ep-form-row">
            <div className="ep-form-group">
              <label htmlFor="districtId">District {requiredLabel}</label>
              <select
                id="districtId"
                name="districtId"
                value={placeData.districtId}
                onChange={handleChange}
                required
              >
                <option value="">Select a district</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="ep-form-group">
              <label htmlFor="categoryId">Category {requiredLabel}</label>
              <select
                id="categoryId"
                name="categoryId"
                value={placeData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ep-form-actions">
            <button
              type="button"
              className="admincancel-button"
              onClick={() => navigate("/admin/places-management")}
            >
              Back
            </button>
            <button
              type="submit"
              className="adminsave-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Place"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlace;
