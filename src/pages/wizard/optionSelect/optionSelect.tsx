import React from "react";
import checkIcon from "../../../assets/check-icon.svg"; 
import "./optionSelect.css";

interface OptionSelectProps {
  feature: {
    id: string;
    name: string;
    imageURL: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const OptionSelect: React.FC<OptionSelectProps> = ({ feature, isSelected, onSelect }) => {
  return (
    <div className={`persona-item ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <img src={feature.imageURL} alt={feature.name} className="feature-image" />
      <div className="persona-name">{feature.name}</div>
      {isSelected && (
        <div className="check-icon">
          <img src={checkIcon} alt="Selected" />
        </div>
      )}
    </div>
  );
};

export default OptionSelect;
