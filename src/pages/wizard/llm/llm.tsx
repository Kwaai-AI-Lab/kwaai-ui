import React, { useEffect } from "react";
import { LlmOption } from "../../../data/types";
import LlmItem from "./llmItem";
import useAssistants from "../../../hooks/assistants.hook";
import "./llm.css";
import { DotLoader } from "react-spinners";

interface LlmProps {
  onSelect: (option: LlmOption) => void;
  selectedLlmOption: LlmOption;
  errors?: { [key: string]: string };
}

const Llm: React.FC<LlmProps> = ({ onSelect, selectedLlmOption, errors }) => {
  const { assistants } = useAssistants("llm");

  const mappedAssistants = assistants.map((assistant) => ({
    name: assistant.name,
    uri: assistant.uri,
    description: assistant.description,
    resource_llm_id: assistant.resource_llm_id || null,
    persona_id: assistant.persona_id || null,
    files: assistant.files || [],
    image:
      "https://imgs.search.brave.com/3IT2B1Qx6MpLlcvpcU0zzTToEviB5NlO1OmSmRV1CP8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1Xzhz/azdmOC9zdHlsZXMv/Y29tbXVuaXR5SWNv/bl94NWU2djM4N2pm/OGMxLnBuZw",
    status: assistant.status || null,
    allow_edit: assistant.allow_edit || null,
    kind: assistant.kind || "llm",
    icon: assistant.icon || null,
    id: assistant.id || "",
    isActive: assistant.is_active !== "False",
  }));

  useEffect(() => {
    if (!selectedLlmOption?.id && mappedAssistants.length > 0) {
      onSelect(mappedAssistants[0]);
    }
  }, [selectedLlmOption, mappedAssistants, onSelect]);

  return (
    <div className="llm-container">
      {errors?.resource_llm_id && (
        <div className="error-message">{errors.resource_llm_id}</div>
      )}
      <div className="llm-list-grid">
        {mappedAssistants.length > 0 ? (
          mappedAssistants.map((llm) => (
            <LlmItem
              key={llm.id}
              llmItemData={llm}
              isSelected={selectedLlmOption.id === llm.id}
              onSelect={onSelect}
              isActive={llm.isActive}
            />
          ))
        ) : (
          <div className="loader-container">
            <DotLoader color="#5967F1" size={60} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Llm;
