import React, { useState } from "react";
import DistrictCard from "./DistrictCard";
import "./DistrictCategories.css";

const categories = [
  {
    id: "nature",
    title: "Best for Nature & Scenic Experiences",
    subtitle:
      "Ideal for eco-tourism, hiking, waterfalls, mountains, and green escapes.",
    districts: [
      "Nuwara Eliya",
      "Badulla",
      "Monaragala",
      "Ratnapura",
      "Matale",
      "Kegalle",
    ],
  },
  {
    id: "coastal",
    title: "Best for Coastal & Beach Vacations",
    subtitle: "Perfect for beach lovers, surfing, snorkeling, and sunsets.",
    districts: [
      "Galle",
      "Matara",
      "Hambantota",
      "Trincomalee",
      "Batticaloa",
      "Puttalam",
      "Mullaitivu",
    ],
  },
  {
    id: "history",
    title: "Best for History & Culture",
    subtitle: "Rich in temples, ruins, ancient cities, and heritage.",
    districts: [
      "Anuradhapura",
      "Polonnaruwa",
      "Kandy",
      "Jaffna",
      "Mannar",
      "Kilinochchi",
      "Vavuniya",
    ],
  },
  {
    id: "urban",
    title: "Best for Urban & Modern Experiences",
    subtitle: "Busy areas with nightlife, shopping, business, and dining.",
    districts: ["Colombo", "Gampaha", "Kurunegala"],
  },
  {
    id: "spiritual",
    title: "Best for Spiritual & Religious Tourism",
    subtitle: "Sacred temples, dagobas, kovils, and cultural rituals.",
    districts: ["Kandy", "Anuradhapura", "Dambulla", "Matale", "Jaffna"],
  },
  {
    id: "rural",
    title: "Best for Rural & Local Life",
    subtitle: "Rustic living, agriculture, hidden gems.",
    districts: ["Ampara", "Monaragala", "Kurunegala", "Kilinochchi"],
  },
];

const DistrictCategories = ({ districts, onSelectDistrict }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Group districts by category
  const getDistrictsForCategory = (categoryDistricts) => {
    return districts.filter((district) =>
      categoryDistricts.includes(district.name)
    );
  };

  return (
    <div className="district-categories">
      {categories.map((category) => {
        const categoryDistricts = getDistrictsForCategory(category.districts);

        if (categoryDistricts.length === 0) return null;

        return (
          <div key={category.id} className="category-section">
            <div className="category-header">
              <h2 className="category-title">{category.title}</h2>
              <p className="category-subtitle">{category.subtitle}</p>
            </div>

            <div className="districts-grid">
              {categoryDistricts.map((district) => (
                <DistrictCard
                  key={district.id}
                  district={district}
                  onClick={() => onSelectDistrict(district)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DistrictCategories;
