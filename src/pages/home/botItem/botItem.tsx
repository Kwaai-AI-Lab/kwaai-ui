import React, { useEffect, useState } from "react";
import { Bot, Persona } from "../../../data/types";
import botIcon from "../../../assets/bot-icon.png";
import shareIcon from "../../../assets/share-icon.png";
import { AgentViewType, useAgents } from "../../../context/botsContext";
import DeleteConfirmationModal from "../../../components/deleteMessage/deleteConfirmationModal";
import ShareConfirmationModal from "../../../components/shareMessage/shareConfirmationModal";
import PrimaryButton from "../../../components/buttons/primaryButton/primaryButton";
import SecondaryButton from "../../../components/buttons/secondaryButton/secondaryButton";
import "./botItem.css";
import PersonasService from "../../../services/personas.service";

interface BotItemProps {
  botItemData: Bot | Persona;
  onBotSelect: (bot: Bot | Persona) => void;
  onEditBot: (bot: Bot | Persona) => void;
  onBotDelete: (botId: string) => void;
  onError: (message: string) => void;
}

const BotItem: React.FC<BotItemProps> = ({ botItemData, onBotSelect, onEditBot, onBotDelete, onError }) => {
  const { agentViewType } = useAgents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [personaImage, setPersonaImage] = useState(botIcon);

  const personaImages: { [key: string]: string } = {
    "7bea4732-214f-40e7-9161-4e7241a2b97e": "https://static.vecteezy.com/system/resources/previews/026/536/284/non_2x/27yr-old-beautiful-face-ai-generated-free-photo.jpg",
    "7bea4732-214f-40e7-9161-4e7241a2b97f": "https://img.freepik.com/premium-photo/face-that-has-word-ai-it_872754-2069.jpg",
    "7bea4732-214f-40e7-9161-4e7241a2b97a": "https://images.nightcafe.studio//assets/man-in-suit.jpg?tr=w-1600,c-at_max",
    "7bea4732-214f-40e7-9161-4e7241a2b97b": "/DrEvelyn.png",
    "7bea4732-214f-40e7-9161-4e7241a2b97c": "/DrMarcus.png",
    "7bea4732-214f-40e7-9161-4e7241a2b97d": "/DrLinda.png",
  };

  useEffect(() => {
    const fetchPersonas = async () => {
      if ('persona_id' in botItemData && botItemData.persona_id) {
        try {
          const personasService = new PersonasService();
          const fetchedPersona = await personasService.getPersona(botItemData.persona_id);
          if (fetchedPersona && fetchedPersona.face_id) {
            const imageUrl = personaImages[fetchedPersona.face_id] || botIcon;
            setPersonaImage(imageUrl);
          } else {
            setPersonaImage(botIcon);
          }
        } catch (error) {
          console.error("Error fetching persona:", error);
          setPersonaImage(botIcon);
        }
      } else if ('face_id' in botItemData && botItemData.face_id) {
        const imageUrl = personaImages[botItemData.face_id] || botIcon;
        setPersonaImage(imageUrl);
      } else {
        setPersonaImage(botIcon);
      }
    };

    fetchPersonas();
  }, [botItemData, personaImages]);

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (!botItemData.id) {
      onError("Bot ID is missing");
      return;
    }
    onBotDelete(botItemData.id);
    setIsModalOpen(false);
  };

  console.log("BotItem.tsx", botItemData);

  return (
    <div className="bot-card">
      <div className="bot-card-header">
        <img src={personaImage} alt="bot" />
      </div>
      <div className="bot-card-body">
        <div className="bot-card-header-with-button">
          <h2 className="bot-card-name">{botItemData.name}</h2>
          {agentViewType === AgentViewType.MyAgents && "status" in botItemData && botItemData.status === "public" && (
            <button className="share-button" onClick={() => setIsShareModalOpen(true)}>
              <img src={shareIcon} alt="Share" />
            </button>
          )}
        </div>
        <p className="bot-card-description">{botItemData.description}</p>
      </div>
      <div className="bot-buttons-area">
        {(agentViewType === AgentViewType.MyAgents || agentViewType === AgentViewType.Personas) ? (
          <>
            <SecondaryButton text="Delete" onClick={handleDelete} enabled={true} />
            <PrimaryButton text="Edit" onClick={() => onEditBot(botItemData)} enabled={true} />
          </>
        ) : (
          <PrimaryButton text="Go to Course" onClick={() => onBotSelect(botItemData)} enabled={true} />
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
      <ShareConfirmationModal
        isOpen={isShareModalOpen}
        onRequestClose={() => setIsShareModalOpen(false)}
        onConfirm={() => { /* Implement share logic if needed */ }}
        bot={botItemData}
      />
    </div>
  );
};

export default BotItem;
