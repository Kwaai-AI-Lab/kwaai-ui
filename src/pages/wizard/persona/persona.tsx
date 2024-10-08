import React, { useEffect, useState } from "react";
import "./persona.css";
import OptionSelect from "../optionSelect/optionSelect";
import { Bot, Feature } from "../../../data/types";
import { DotLoader } from "react-spinners";
import usePersonas from "../../../hooks/personas.hook";

interface PersonaProps {
  bot: Bot;
  setBot: React.Dispatch<React.SetStateAction<Bot>>;
  errors?: { [key: string]: string };
}

const personaImages: { [key: string]: string } = {
  "7bea4732-214f-40e7-9161-4e7241a2b97e": "https://static.vecteezy.com/system/resources/previews/026/536/284/non_2x/27yr-old-beautiful-face-ai-generated-free-photo.jpg",
  "7bea4732-214f-40e7-9161-4e7241a2b97f": "https://img.freepik.com/premium-photo/face-that-has-word-ai-it_872754-2069.jpg",
  "7bea4732-214f-40e7-9161-4e7241a2b97a": "https://images.nightcafe.studio//assets/man-in-suit.jpg?tr=w-1600,c-at_max",
  "7bea4732-214f-40e7-9161-4e7241a2b97b": "/DrEvelyn.png",
  "7bea4732-214f-40e7-9161-4e7241a2b97c": "/DrMarcus.png",
  "7bea4732-214f-40e7-9161-4e7241a2b97d": "/DrLinda.png",
};

const Persona: React.FC<PersonaProps> = ({ bot, setBot, errors }) => {
  const { personas: personaList, error } = usePersonas();
  const [loading, setLoading] = useState(true);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    bot.persona_id || null
  );

  useEffect(() => {
    if (personaList.length > 0) {
      if (!selectedPersonaId) {
        const firstPersonaId = personaList[0]?.id ?? "";
        setSelectedPersonaId(firstPersonaId);
        setBot((prevBot) => ({ ...prevBot, persona_id: firstPersonaId || "" }));
      }
      setLoading(false);
    }
  }, [personaList, selectedPersonaId, setBot]);

  const selectedPersona = personaList.find((persona) => persona.id === selectedPersonaId);

  const handleSelect = (persona: Feature) => {
    setSelectedPersonaId(persona.id);
    setBot((prevBot) => ({ ...prevBot, persona_id: persona.id }));
  };

  return (
    <div className="persona-wrapper">
      {loading ? (
        <div className="loader-container">
          <DotLoader color="#045CE2" size={60} />
        </div>
      ) : error ? (
        <div className="error-message top-error">{error}</div>
      ) : (
        <>
          {errors?.persona_id && (
            <div className="error-message top-error">{errors.persona_id}</div>
          )}
          <div className="persona-container">
            <div className="persona-left-container">
              {personaList.map((persona) => (
                <OptionSelect
                  key={persona.id}
                  feature={{
                    ...persona,
                    imageURL: personaImages[persona.face_id] || "",
                  }}
                  isSelected={persona.id === selectedPersonaId}
                  onSelect={() => handleSelect(persona)}
                />
              ))}
            </div>
            <div className="persona-right-container">
              {selectedPersona && (
                <div className="persona-preview-container">
                  <img
                    src={personaImages[selectedPersona.face_id] || ""}
                    alt={selectedPersona.name}
                    className="selected-persona-image"
                  />
                  <p className="selected-persona-text">{selectedPersona.name}</p>
                  <p className="selected-persona-description">
                    {selectedPersona.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Persona;
