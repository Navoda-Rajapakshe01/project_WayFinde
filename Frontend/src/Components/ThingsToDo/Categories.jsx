import React from "react";
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
  const categoryMapping = {
    Wildlife: 1, 
    Resorts: 2, 
    Historical: 3, 
    Nature: 4, 
    Adventure: 5, 
  };

  const handleFilter = (selectedCategory) => {
    if (selectedCategory === "All Places") {
      setFilteredPlaces(places); // Show all places
    } else {
      const selectedCategoryId = categoryMapping[selectedCategory];
      const filtered = places.filter(
        (place) => place.category_id === selectedCategoryId
      );
      setFilteredPlaces(filtered);
    }
  };

  return (
    <div className="categories-container">
      <div className="category-section">
        <div className="categories">
          <div className="category" onClick={() => handleFilter("All Places")}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faGlobe} size="2x" />
            </div>
            <p>All Places</p>
          </div>
          <div className="category" onClick={() => handleFilter("Wildlife")}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faPaw} size="2x" />
            </div>
            <p>Wildlife</p>
          </div>
          <div className="category" onClick={() => handleFilter("Resorts")}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faUmbrellaBeach} size="2x" />
            </div>
            <p>Resorts</p>
          </div>
          <div className="category" onClick={() => handleFilter("Historical")}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faTheaterMasks} size="2x" />
            </div>
            <p>
              Historical & <br />
              Religious
            </p>
          </div>
          <div className="category" onClick={() => handleFilter("Nature")}>
            <div className="icon-container">
              <FontAwesomeIcon icon={faLeaf} size="2x" />
            </div>
            <p>
              Nature & <br />
              Scenic
            </p>
          </div>
          <div className="category" onClick={() => handleFilter("Adventure")}>
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
