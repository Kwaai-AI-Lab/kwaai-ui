import React, { useState } from "react";
import { Bot } from "../../../data/types";
import botIcon from "../../../assets/bot-icon.png";
import shareIcon from "../../../assets/share-icon.png";
import { useAgents, AgentViewType } from "../../../context/botsContext";
import DeleteConfirmationModal from "../../../components/deleteMessage/deleteConfirmationModal";
import ShareConfirmationModal from "../../../components/shareMessage/shareConfirmationModal";
import PrimaryButton from "../../../components/buttons/primaryButton/primaryButton";
import SecondaryButton from "../../../components/buttons/secondaryButton/secondaryButton";
import AssistantsService from "../../../services/assistants.service";
import "./botItem.css";

interface BotItemProps {
  botItemData: Bot;
  onBotSelect: (bot: Bot) => void;
  onEditBot: (bot: Bot) => void;
}

const BotItem: React.FC<BotItemProps> = ({ botItemData, onBotSelect, onEditBot }) => {
  const { removeToMyAgent, agentViewType } = useAgents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const personaImages: { [key: string]: string } = {
    "7bea4732-214f-40e7-9161-4e7241a2b97e": "https://static.vecteezy.com/system/resources/previews/026/536/284/non_2x/27yr-old-beautiful-face-ai-generated-free-photo.jpg",
    "7bea4732-214f-40e7-9161-4e7241a2b97f": "https://img.freepik.com/premium-photo/face-that-has-word-ai-it_872754-2069.jpg",
    "7bea4732-214f-40e7-9161-4e7241a2b97a": "https://images.nightcafe.studio//assets/man-in-suit.jpg?tr=w-1600,c-at_max",
    "7bea4732-214f-40e7-9161-4e7241a2b97h": "/DrEvelyn.png",
    "7bea4732-214f-40e7-9161-4e7241a2b97i": "/DrMarcus.png",
    "7bea4732-214f-40e7-9161-4e7241a2b97j": "/DrLinda.png",
  };
  

  const handleDelete = async () => {
    try {
      const assistantsService = new AssistantsService();
      await assistantsService.deleteAssistant(botItemData.id);
      removeToMyAgent(botItemData.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting assistant:", error);
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

  const imageUrl = personaImages[botItemData.persona_id || ""] || botIcon;

  return (
    <div className="bot-card">
      <div className="bot-card-header">
        <img src={imageUrl} alt="bot" />
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
        {agentViewType === AgentViewType.MyAgents ? (
          <>
            <SecondaryButton text="Delete" onClick={handleDeleteClick} enabled={true} />
            <PrimaryButton text="Edit" onClick={handleEditClick} enabled={true} />
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
