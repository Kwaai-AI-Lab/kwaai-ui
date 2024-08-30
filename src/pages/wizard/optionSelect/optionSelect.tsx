import React from "react";
import { Feature, Face } from "../../../data/types";
import "./optionSelect.css";

interface OptionSelectProps {
  feature: Feature | Face;
  isSelected: boolean;
  onSelect: () => void;
}

const OptionSelect: React.FC<OptionSelectProps> = ({ feature, isSelected, onSelect }) => {
  console.log("feature___________________________",feature);
  return (
    <div className="persona-item" onClick={onSelect}>
        <img src={feature?.imageURL} alt={feature?.name} className="feature-image" />
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
