import React from "react";
import Modal from "react-modal";
import PrimaryButton from "../../components/buttons/primaryButton/primaryButton";
import SecondaryButton from "../../components/buttons/secondaryButton/secondaryButton";

import "./deleteConfirmationModal.css"; // Reuse the existing styles or create new ones

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2>Are you sure you want to delete this bot?</h2>
      <div className="modal-buttons">
        <SecondaryButton text="Delete" onClick={onConfirm} enabled={true} />
        <PrimaryButton text="Cancel" onClick={onRequestClose} enabled={true} />
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
