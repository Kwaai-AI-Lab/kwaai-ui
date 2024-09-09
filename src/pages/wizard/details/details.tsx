import React from "react";
import { Bot, Persona } from "../../../data/types";
import "./details.css";
import { useEffect, useState } from "react";
import { AgentViewType } from "../../../context/botsContext";

interface DetailsProps {
  bot: Bot | Persona;
  setBot: React.Dispatch<React.SetStateAction<Bot | Persona>>;
  errors?: { [key: string]: string };
  viewType: AgentViewType;
}

const Details: React.FC<DetailsProps> = ({ viewType,bot, setBot, errors }) => {
  const [title, setTitle] = useState<string>("Assistant");
  
  useEffect(() => {
      if (viewType === AgentViewType.MyAgents || viewType === AgentViewType.SharedAgents) {
        setTitle("Assistant");
      } else if (viewType === AgentViewType.Personas) {
        setTitle("Persona");
      }
    }, [viewType]);

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBot((prevBot) => ({
      ...prevBot,
      name: e.target.value,
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBot((prevBot) => ({
      ...prevBot,
      description: e.target.value,
    }));
  };

  return (
    <div className="detail-container">
      <span className="details-subtitle">{title}'s Name :</span>
      {errors?.name && <span className="error-message">{errors.name}</span>}
      <textarea
        rows={3}
        className='details-name'
        value={bot.name}
        onChange={handleNameChange}
      />

      <span className="details-subtitle">Description :</span>
      {errors?.description && <span className="error-message">{errors.description}</span>}
      <textarea
        rows={6}
        className="details-description"
        value={bot.description}
        onChange={handleDescriptionChange}
      />
    </div>
  );
};

export default Details;
