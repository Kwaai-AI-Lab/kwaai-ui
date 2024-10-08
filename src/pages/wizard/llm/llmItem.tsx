import React from "react";
import checkIcon from "../../../assets/check-icon.svg";
import { LlmOption } from "../../../data/types";
import "./llmItem.css";

interface LlmItemProps {
  llmItemData: LlmOption;
  isSelected: boolean;
  onSelect: (option: LlmOption) => void;
  isActive: boolean;
}

const LlmItem: React.FC<LlmItemProps> = ({ llmItemData, isSelected, onSelect, isActive }) => {
  const handleClick = () => {
    if (isActive) {
      onSelect(llmItemData);
    }
  };

  return (
    <div 
      className={`llm-card ${isSelected ? 'selected' : ''} ${!isActive ? 'inactive' : ''}`} 
      onClick={handleClick}
      style={{ opacity: isActive ? 1 : 0.5 }}
    >
      <div className="llm-card-top">
        <img
          src={llmItemData.image}
          alt="llm-logo"
        />
        {isSelected && (
          <div className="check-icon">
            <img src={checkIcon} alt="Selected" />
          </div>
        )}
      </div>
      <div className="llm-card-bottom">
        <label className="llm-card-radio">
          <span className="llm-card-title">{llmItemData.name}</span>
        </label>
      </div>
    </div>
  );
};

export default LlmItem;
