import React from "react";
import Modal from "react-modal";
import PrimaryButton from "../../components/buttons/primaryButton/primaryButton";
import SecondaryButton from "../../components/buttons/secondaryButton/secondaryButton";
import roundCrossIcon from "../../assets/round-box-icon.png";
import { Bot, Persona } from "../../data/types";
import "./shareConfirmationModal.css"; // Reuse the existing styles or create new ones

interface ShareConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  bot: Bot | null | Persona;
}

const ShareConfirmationModal: React.FC<ShareConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  bot,
}) => {
  const handleCopyClick = () => {
    if (bot) {
      const shareText = `https://www.kwaai.com/bot/${bot.id}`;
      navigator.clipboard.writeText(shareText).then(
        () => {
          console.log('Copied to clipboard successfully!');
        },
        (err) => {
          console.error('Failed to copy the text to clipboard', err);
        }
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <h1 className="modal-title">Share</h1>
        <button className="close-button" onClick={onRequestClose}>
          <img src={roundCrossIcon} alt="Close" className="close-icon" />
        </button>
      </div>
      <h2>Copy link to share {bot?.name} with students or professors.</h2>
      <div className="share-div">
        <p className="share-text">https://www.kwaai.com/bot/{bot?.id}</p>
        <PrimaryButton text="Copy" onClick={handleCopyClick} enabled={true} />
      </div>
      <div className="modal-buttons">
        <SecondaryButton text="Delete" onClick={onConfirm} enabled={true} />
        <PrimaryButton text="Cancel" onClick={onRequestClose} enabled={true} />
      </div>
    </Modal>
  );
};

export default ShareConfirmationModal;
