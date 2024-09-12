import React, { useEffect, useState } from "react";
import { Bot, Persona } from "../../../data/types";
import botIcon from "../../../assets/bot-icon.png";
import shareIcon from "../../../assets/share-icon.png";
import { useAgents, AgentViewType } from "../../../context/botsContext";
import DeleteConfirmationModal from "../../../components/deleteMessage/deleteConfirmationModal";
import ShareConfirmationModal from "../../../components/shareMessage/shareConfirmationModal";
import PrimaryButton from "../../../components/buttons/primaryButton/primaryButton";
import SecondaryButton from "../../../components/buttons/secondaryButton/secondaryButton";
import AssistantsService from "../../../services/assistants.service";
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
  const { removeToMyAgent, agentViewType } = useAgents();
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
          setPersonaImage(botIcon); // Fallback image
        }
      } else if ('face_id' in botItemData && botItemData.face_id) {
        const imageUrl = personaImages[botItemData.face_id] || botIcon;
        setPersonaImage(imageUrl);
      } else {
        setPersonaImage(botIcon);
      }
    };

    fetchPersonas();
  }, [botItemData]);

  const handleDeleteBot = async () => {
    try {
      const assistantsService = new AssistantsService();
      await assistantsService.deleteAssistant(botItemData.id);
      onBotDelete(botItemData.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting assistant:", error);
      onError("Error deleting assistant");
    }
  };

  const handleDeletePersona = async () => {
    try {
      const personasService = new PersonasService();
      await personasService.deletePersona(botItemData.id);
      onBotDelete(botItemData.id);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error deleting persona:", error);
      onError(`Error deleting persona ${error.message.toLowerCase()}`);
    }
  };
  const handleDelete = () => {
    if ('uri' in botItemData) {
      handleDeleteBot();
    } else {
      handleDeletePersona();
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleEditClick = () => {
    onEditBot(botItemData);
  };

  const handleGoToCourseClick = () => {
    onBotSelect(botItemData);
  };

  return (
    <div className="bot-card">
      <div className="bot-card-header">
        <img src={personaImage} alt="bot" />
      </div>
      <div className="bot-card-body">
        <div className="bot-card-header-with-button">
          <h2 className="bot-card-name">{botItemData.name}</h2>
          {agentViewType === AgentViewType.MyAgents && (
            <button className="share-button" onClick={handleShareClick}>
              <img src={shareIcon} alt="Share" />
            </button>
          )}
        </div>
        <p className="bot-card-description">{botItemData.description}</p>
      </div>
      <div className="bot-buttons-area">
        {agentViewType === AgentViewType.MyAgents || agentViewType === AgentViewType.Personas ? (
          <>
            <SecondaryButton text="Delete" onClick={handleDeleteClick} enabled={true} />
            <PrimaryButton text="Edit" onClick={handleEditClick} enabled={!!('uri' in botItemData || AgentViewType.Personas)} />
          </>
        ) : (
          <PrimaryButton text="Go to Course" onClick={handleGoToCourseClick} enabled={true} />
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
      <ShareConfirmationModal
        isOpen={isShareModalOpen}
        onRequestClose={() => setIsShareModalOpen(false)}
        onConfirm={handleDelete}
        bot={botItemData}
      />
    </div>
  );
};

export default BotItem;
