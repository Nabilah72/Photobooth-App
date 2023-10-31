import React from "react";
import "../styles/FilterButtons.css";
import no from "../images/no.png"
import sepia from "../images/sepia.png"
import grayscale from "../images/greyscale.png"
import blur from "../images/blur.png"
import invert from "../images/invert.png"
import saturate from "../images/saturate.png"

const FilterButtons = ({ applyFilter, removeFilter, activeFilter }) => {

  const handleFilterClick = (filter) => {
    if (filter === "remove-filter") {
      removeFilter();
    } else {
      applyFilter(filter);
    }
  };

  const filterButtons = [
    { name: "No Filter", icon: no, value: "remove-filter" },
    { name: "Sepia Filter", icon: sepia, value: "filter-sepia" },
    { name: "Grayscale Filter", icon: grayscale, value: "filter-grayscale" },
    { name: "Blur Filter", icon: blur, value: "filter-blur" },
    { name: "Invert Filter", icon: invert, value: "filter-invert" },
    { name: "Saturate Filter", icon: saturate, value: "filter-saturate" },

  ];

  return (
    <div>
      <div className="filter-button-group">
        {filterButtons.map((filter) => (
          <button
            key={filter.value}
            className={`filter-button ${activeFilter === filter.value ? "selected" : ""}`}
            onClick={() => handleFilterClick(filter.value)}
          >
            <div className="filter-icon-wrapper">
              {filter.icon && <img src={filter.icon} alt={`${filter.name} Icon`} className="filter-icon" />}
            </div>
            <div className="filter-text">{filter.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterButtons;
