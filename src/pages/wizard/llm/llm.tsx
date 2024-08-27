import React, { useEffect } from "react";
import { LlmOption } from "../../../data/types";
import llmOptionsData from "../../../data/llm.json";
import LlmItem from "./llmItem";
import useAssistants from "../../../hooks/assistants.hook";
import "./llm.css";

interface LlmProps {
  onSelect: (option: LlmOption) => void;
  selectedLlmOption: LlmOption;
  errors?: { [key: string]: string };
}

const Llm: React.FC<LlmProps> = ({ onSelect, selectedLlmOption, errors }) => {
  const { assistants } = useAssistants("llm");

  // Mapeo de los datos
  const mappedAssistants = assistants.map((assistant) => ({
    name: assistant.name,
    uri: assistant.uri,
    description: assistant.description,
    resource_llm_id: assistant.resource_llm_id || null,
    persona_id: assistant.persona_id || null,
    files: assistant.files || [],
    image: "https://imgs.search.brave.com/3IT2B1Qx6MpLlcvpcU0zzTToEviB5NlO1OmSmRV1CP8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1Xzhz/azdmOC9zdHlsZXMv/Y29tbXVuaXR5SWNv/bl94NWU2djM4N2pm/OGMxLnBuZw",
    status: assistant.status || null,
    allow_edit: assistant.allow_edit || null,
    kind: assistant.kind || "llm",
    icon: assistant.icon || null,
    id: assistant.id || "", // Asegurar que `id` sea siempre una string
  }));

  useEffect(() => {
    if (!selectedLlmOption?.id && llmOptionsData.length > 0) {
      onSelect(llmOptionsData[0]);
    }
  }, [selectedLlmOption, onSelect]);

  return (
    <div className="llm-container">
      {errors?.resource_llm_id && (
        <div className="error-message">{errors.resource_llm_id}</div>
      )}
      <div className="llm-list-grid">
        {mappedAssistants.map((llm) => (
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
};

export default Llm;
