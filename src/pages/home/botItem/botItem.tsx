import React, { useState } from "react";
import { Bot } from "../../../data/types";
import botIcon from "../../../assets/bot-icon.png";
import shareIcon from "../../../assets/share-icon.png";
import { useAgents, AgentViewType } from "../../../context/botsContext";
import DeleteConfirmationModal from "../../../components/deleteMessage/deleteConfirmationModal";
import ShareConfirmationModal from "../../../components/shareMessage/shareConfirmationModal";
import PrimaryButton from "../../../components/buttons/primaryButton/primaryButton";
import SecondaryButton from "../../../components/buttons/secondaryButton/secondaryButton";
import "./botItem.css";

interface BotItemProps {
  botItemData: Bot;
  onBotSelect: (bot: Bot) => void;
  onEditBot: (bot: Bot) => void; // Add new prop for handling edit
}

const BotItem: React.FC<BotItemProps> = ({ botItemData, onBotSelect, onEditBot }) => {
  const { removeToMyAgent, agentViewType } = useAgents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleDelete = () => {
    removeToMyAgent(botItemData.id);
    setIsModalOpen(false);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleEditClick = () => {
    onEditBot(botItemData); // Pass botItemData to onEditBot
  };

  const handleGoToCourseClick = () => {
    console.log('Go to course');
    onBotSelect(botItemData);
  };

  return (
    <div className="bot-card">
      <div className="bot-card-header">
        <img src={botItemData.img ? botItemData.img : botIcon} alt="bot" />
      </div>
      <div className="bot-card-body">
        <div className="bot-card-header-with-button">
          <h2 className="bot-card-name">{botItemData.name}</h2>
          { agentViewType === AgentViewType.MyAgents && (
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
        bot={botItemData} // Pass the botItemData here
      />
    </div>
  );
}

export default BotItem;
