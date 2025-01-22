import React from "react";
import { Feature, Face, Voices } from "../../../data/types";
import "./optionSelect.css";
import blueCheckmark from "../../../assets/blue-check.png";

interface OptionSelectProps {
  feature: Feature | Face | Voices;
  isSelected: boolean;
  onSelect: () => void;
}

const OptionSelect: React.FC<OptionSelectProps> = ({ feature, isSelected, onSelect }) => {
  return (
    <div
      className={`persona-item ${isSelected ? "selected" : "unselected"} ${isSelected ? "gray-shadow" : ""}`}
      onClick={onSelect}
    >
      {/* Checkmark icon, shown only when selected */}
      {isSelected && (
        <div className="checkmark-container">
          <img src={blueCheckmark} alt="Selected" className="checkmark-image" />
        </div>
      )}
      <div className={`image-container ${isSelected ? "selected-ring" : ""}`}>
        <img src={feature.imageURL} alt={feature.name} className="feature-image" />
      </div>
      <div className="radio-button-container">
        <input
          type="radio"
          id={feature.id}
          name="feature"
          value={feature.name}
          checked={isSelected}
          readOnly
        />
        <label htmlFor={feature.id}>{feature.name}</label>
      </div>
    </div>
  );
};

export default OptionSelect;
