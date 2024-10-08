import React from 'react';
import './prevButton.css';

interface PrevButtonProps {
  text: string;
  onClick: () => void;
  enabled: boolean;
}

const PrevButton: React.FC<PrevButtonProps> = ({ text, onClick, enabled }) => {
  return (
    <button
      className={`prev-button ${enabled ? 'enabled' : 'disabled'}`}
      onClick={onClick}
      disabled={!enabled}
    >
      {text}
    </button>
  );
}

export default PrevButton;
