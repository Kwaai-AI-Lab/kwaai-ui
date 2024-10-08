import React from 'react';
import './cardButton.css';

interface CardButtonProps {
  text: string;
  onClick: () => void;
  enabled: boolean;
}

const CardButton: React.FC<CardButtonProps> = ({ text, onClick, enabled }) => {
  return (
    <button
      className={`card-button ${enabled ? 'enabled' : 'disabled'}`}
      onClick={onClick}
      disabled={!enabled}
    >
      {text}
    </button>
  );
}

export default CardButton;
