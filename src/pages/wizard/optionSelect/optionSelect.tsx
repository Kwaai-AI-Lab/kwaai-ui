import React from "react";
import { Feature, Face, Voices } from "../../../data/types";
import "./optionSelect.css";

interface OptionSelectProps {
  feature: Feature | Face | Voices;
  isSelected: boolean;
  onSelect: () => void;
}

const OptionSelect: React.FC<OptionSelectProps> = ({ feature, isSelected, onSelect }) => {
  return (
    <div className="persona-item" onClick={onSelect}>
        <img src={feature.imageURL} alt={feature.name} className="feature-image" />
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
