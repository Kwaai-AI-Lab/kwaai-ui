import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import AssistantsService from "../../services/assistants.service";
import PrimaryButton from "../../components/buttons/primaryButton/primaryButton";
import SecondaryButton from "../../components/buttons/secondaryButton/secondaryButton";
import roundCrossIcon from "../../assets/round-box-icon.png";
import { Bot, Persona } from "../../data/types";
import { FaCalendarAlt } from "react-icons/fa";
import {DotLoader} from "react-spinners";
import "./shareConfirmationModal.css";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkHeader, setLinkHeader] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const url = window.location.href;
    const urlParts = url.split("/");
    const domain = urlParts[2];
    setLinkHeader(`http://${domain}/share/`);
  }, []);

  const handleGenerateLinkClick = async () => {
    if (bot && selectedDate) {
      setLoading(true);
      const expirationDate = selectedDate.toISOString();
      try {
        const response = await AssistantsService.shareAssistant(bot.id || "", expirationDate);
        setGeneratedLink(`${linkHeader}${response.id}`);
      } catch (error) {
        console.error("Error generating link:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopyClick = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink).then(
        () => {
          console.log("Copied to clipboard successfully!");
        },
        (err) => {
          console.error("Failed to copy the text to clipboard", err);
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

      <div className="date-picker-container">
        <label>Select Expiration Date and Time:</label>
        <div className="date-picker-input">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Choose date and time"
            className="date-picker-input-field"
          />
          <FaCalendarAlt className="date-picker-icon" />
        </div>
      </div>

      <div className="share-div">
        <p className="share-text">
          {generatedLink || "Link will be generated here"}
        </p>
        {loading ? (
          <DotLoader color="#5967F1" size={24} />
        ) : generatedLink ? (
          <PrimaryButton text="Copy" onClick={handleCopyClick} enabled={true} />
        ) : (
          <PrimaryButton
            text="Generate Link"
            onClick={handleGenerateLinkClick}
            enabled={!!selectedDate}
          />
        )}
      </div>

      <div className="modal-buttons">
        <SecondaryButton text="Delete" onClick={onConfirm} enabled={true} />
        <PrimaryButton text="Cancel" onClick={onRequestClose} enabled={true} />
      </div>
    </Modal>
  );
};

export default ShareConfirmationModal;
