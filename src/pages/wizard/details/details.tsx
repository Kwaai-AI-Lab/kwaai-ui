import React from "react";
import { Bot } from "../../../data/types";
import "./details.css";

interface DetailsProps {
  bot: Bot;
  setBot: React.Dispatch<React.SetStateAction<Bot>>;
  errors?: { [key: string]: string };
}

const Details: React.FC<DetailsProps> = ({ bot, setBot, errors }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBot({ ...bot, name: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setBot({ ...bot, description: e.target.value });
  };

  return (
    <div className="detail-container">
      <span className="details-subtitle">Assistant's Name :</span>
      {errors?.name && <span className="error-message">{errors.name}</span>}
      <textarea
        rows={3}
        className='details-name'
        value={bot.name}
        onChange={handleNameChange}
      />

      <span className="details-subtitle">Description :</span>
      {errors?.description && (
        <span className="error-message">{errors.description}</span>
      )}
      <textarea
        rows={6}
        className='details-description'
        value={bot.description}
        onChange={handleDescriptionChange}
      />
    </div>
  );
};

export default Details;
