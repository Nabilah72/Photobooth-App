import React, { useState } from "react";
import "../styles/FilterButtons.css";

const FilterButtons = ({ applyFilter, removeFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState("");

  const handleFilterClick = (filter) => {
    if (filter === "remove-filter") {
      removeFilter();
    } else {
      applyFilter(filter);
    }

    setSelectedFilter(filter);
  };

  return (
    <div>
      <div className="filter-button-group">
        <button
          className={`filter-button ${selectedFilter === "remove-filter" ? "selected" : ""}`}
          onClick={() => handleFilterClick("remove-filter")}
        >
          No Filter
        </button>
        <button
          className={`filter-button ${selectedFilter === "filter-sepia" ? "selected" : ""}`}
          onClick={() => handleFilterClick("filter-sepia")}
        >
          Sepia Filter
        </button>
        <button
          className={`filter-button ${selectedFilter === "filter-grayscale" ? "selected" : ""}`}
          onClick={() => handleFilterClick("filter-grayscale")}
        >
          Grayscale Filter
        </button>
        <button
          className={`filter-button ${selectedFilter === "filter-blur" ? "selected" : ""}`}
          onClick={() => handleFilterClick("filter-blur")}
        >
          Blur Filter
        </button>
        <button
          className={`filter-button ${selectedFilter === "filter-invert" ? "selected" : ""}`}
          onClick={() => handleFilterClick("filter-invert")}
        >
          Invert Filter
        </button>
        <button
          className={`filter-button ${selectedFilter === "filter-saturate" ? "selected" : ""}`}
          onClick={() => handleFilterClick("filter-saturate")}
        >
          Saturate Filter
        </button>
      </div>
    </div>
  );
};

export default FilterButtons;
