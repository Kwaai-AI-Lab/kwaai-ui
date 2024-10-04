import React from 'react';
import botAvatar from "../../assets/empty-bot.png";
import "./emptyMessage.css";
import { IoAddCircleOutline } from "react-icons/io5";

interface EmptyMessageProps {
  onAddNewAgent: () => void;
}

const EmptyMessage: React.FC<EmptyMessageProps> = ({onAddNewAgent}) => {
  return (
    <div className="empty-message">
      <div className='container'>
      <img src={botAvatar} alt="Bot Avatar" className='empty-avatar' />
      <span>Let’s create your first assistant</span>
      <p className='caption'>
        In just <p className='blue-caption'>5 steps</p> you can publish your first coPilot assistant to help you with your administrative efforts
      </p>
      <button className="addButton" onClick={onAddNewAgent}>
        <IoAddCircleOutline className="addButtonIcon" />
        Add New Persona
      </button>
      </div>
    </div>
  );
};

export default EmptyMessage;

