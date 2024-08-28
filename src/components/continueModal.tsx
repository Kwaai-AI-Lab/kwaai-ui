import React from "react";
import Modal from "react-modal";
import PrimaryButton from "../components/buttons/primaryButton/primaryButton";
import SecondaryButton from "../components/buttons/secondaryButton/secondaryButton";
import "./confirmationModal.css";

Modal.setAppElement('#root');

interface ContinueModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ContinueModalProps> = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2 className="modal-title">Are you sure to continue?</h2>
      <p className="modal-text">You can return before deploying your assistant.</p>
      <div className="modal-buttons">
        <SecondaryButton text="Cancel" onClick={onRequestClose} enabled={true} />
        <PrimaryButton text="Continue" onClick={onConfirm} enabled={true} />
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
