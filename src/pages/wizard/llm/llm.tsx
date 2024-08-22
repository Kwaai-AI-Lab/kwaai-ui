import React from "react";
import { LlmOption } from "../../../data/types";
import llmOptionsData from "../../../data/llm.json";
import LlmItem from "./llmItem";
import "./llm.css";

interface LlmProps {
  onSelect: (option: LlmOption) => void;
  selectedLlmOption: LlmOption;
  errors?: { [key: string]: string };
}

const Llm: React.FC<LlmProps> = ({ onSelect, selectedLlmOption, errors }) => {
  return (
    <div className="llm-container">
      {errors?.resource_llm_id && (
        <div className="error-message">{errors.resource_llm_id}</div>
      )}
      <div className="llm-list-grid">
        {llmOptionsData.map((llm) => (
          <LlmItem
            key={llm.id}
            llmItemData={llm}
            isSelected={selectedLlmOption.id === llm.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default Llm;
