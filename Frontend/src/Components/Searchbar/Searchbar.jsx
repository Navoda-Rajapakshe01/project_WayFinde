import React from "react";
import { useState } from "react";

const SearchBar = ({ onSearch, placeHolder }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeHolder}
        className="w-full p-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-md"
      />
    </div>
  );
};

export default SearchBar;
