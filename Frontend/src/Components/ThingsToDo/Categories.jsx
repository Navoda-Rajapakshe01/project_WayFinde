import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faCompass,
  faTheaterMasks,
  faLeaf,
  faHiking,
  faGlobe,
  faUmbrellaBeach,
} from "@fortawesome/free-solid-svg-icons";
import "./Categories.css";

const Categories = ({ places, setFilteredPlaces }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Places");

  const categoryMapping = {
    Wildlife: 1,
    Historical: 2,
    Nature: 3,
    Adventure: 4,
  };

  const handleFilter = (categoryName) => {
    setSelectedCategory(categoryName);

    if (categoryName === "All Places") {
      setFilteredPlaces(places); // Show all
    } else {
      const selectedCategoryId = categoryMapping[categoryName];
      const filtered = places.filter(
        (place) => Number(place.categoryId) === selectedCategoryId
      );
      setFilteredPlaces(filtered);
    }
  };

  return (
    <div className="categories-container">
      <div className="category-section">
        <div className="categories">
          <div
            className={`category ${
              selectedCategory === "All Places" ? "active" : ""
            }`}
            onClick={() => handleFilter("All Places")}
          >
            <div className="icon-container">
              <FontAwesomeIcon icon={faGlobe} size="2x" />
            </div>
            <p>All Places</p>
          </div>
          <div
            className={`category ${
              selectedCategory === "Wildlife" ? "active" : ""
            }`}
            onClick={() => handleFilter("Wildlife")}
          >
            <div className="icon-container">
              <FontAwesomeIcon icon={faPaw} size="2x" />
            </div>
            <p>Wildlife</p>
          </div>
          <div
            className={`category ${
              selectedCategory === "Historical" ? "active" : ""
            }`}
            onClick={() => handleFilter("Historical")}
          >
            <div className="icon-container">
              <FontAwesomeIcon icon={faTheaterMasks} size="2x" />
            </div>
            <p>
              Historical & <br />
              Religious
            </p>
          </div>
          <div
            className={`category ${
              selectedCategory === "Nature" ? "active" : ""
            }`}
            onClick={() => handleFilter("Nature")}
          >
            <div className="icon-container">
              <FontAwesomeIcon icon={faLeaf} size="2x" />
            </div>
            <p>
              Nature & <br />
              Scenic
            </p>
          </div>
          <div
            className={`category ${
              selectedCategory === "Adventure" ? "active" : ""
            }`}
            onClick={() => handleFilter("Adventure")}
          >
            <div className="icon-container">
              <FontAwesomeIcon icon={faHiking} size="2x" />
            </div>
            <p>
              Adventure & <br />
              Activities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
