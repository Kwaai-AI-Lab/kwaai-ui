import React, { useEffect } from "react";
import { useAgents } from "../../../context/botsContext";
import "./persona.css";
import OptionSelect from "../optionSelect/optionSelect";
import { Bot, Feature } from "../../../data/types";

interface PersonaProps {
  bot: Bot;
  setBot: React.Dispatch<React.SetStateAction<Bot>>;
  errors?: { [key: string]: string };
}

const Persona: React.FC<PersonaProps> = ({ bot, setBot, errors }) => {
  const { personaList } = useAgents();
  
  const [selectedPersonaId, setSelectedPersonaId] = React.useState<string | null>(
    bot.persona_id || null
  );

  useEffect(() => {
    if (!selectedPersonaId && personaList.length > 0) {
      setSelectedPersonaId(personaList[0].id);
      setBot((prevBot) => ({ ...prevBot, persona_id: personaList[0].id }));
    }
  }, [personaList, selectedPersonaId, setBot]);

  const selectedPersona = personaList.find((persona) => persona.id === selectedPersonaId);

  const handleSelect = (persona: Feature) => {
    setSelectedPersonaId(persona.id);
    setBot((prevBot) => ({ ...prevBot, persona_id: persona.id }));
  };

  return (
    <div className="persona-wrapper">
      {errors?.persona_id && (
        <div className="error-message top-error">
          {errors.persona_id}
        </div>
      )}
      <div className="persona-container">
        <div className="persona-left-container">
          {personaList.map((persona) => (
            <OptionSelect
              key={persona.id}
              feature={persona}
              isSelected={persona.id === selectedPersonaId}
              onSelect={() => handleSelect(persona)}
            />
          ))}
        </div>
        <div className="persona-right-container">
          {selectedPersona && (
            <div className="persona-preview-container">
              <img
                src={selectedPersona.imageURL}
                alt={selectedPersona.name}
                className="selected-persona-image"
              />
              <p className="selected-persona-description">
                {selectedPersona.description}
              </p>
              <p className="selected-persona-text">{selectedPersona.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Persona;
