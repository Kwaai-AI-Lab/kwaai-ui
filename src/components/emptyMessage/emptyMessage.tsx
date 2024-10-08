import React from 'react';
import botAvatar from "../../assets/empty-bot.png";
import "./emptyMessage.css";
import { IoAddCircleOutline } from "react-icons/io5";
import { AgentViewType } from "../../context/botsContext";

interface EmptyMessageProps {
  onAddNewAgent: () => void;
  viewType: AgentViewType;
}

const EmptyMessage: React.FC<EmptyMessageProps> = ({onAddNewAgent, viewType}) => {

  const getTitle = () => {
    switch (viewType) {
      case AgentViewType.MyAgents:
      case AgentViewType.SharedAgents:
        return "Assistant";
      case AgentViewType.Personas:
        return "Persona";
      default:
        return "Assistant";
    }
  };

  const title = getTitle();

  return (
    <div className="empty-message">
      <div className='container'>
      <img src={botAvatar} alt="Bot Avatar" className='empty-avatar' />
      <span>Let’s create your first {title}</span>
      <p className='caption'>
        In just <p className='blue-caption'>Some steps</p> you can publish your first coPilot assistant to help you with your administrative efforts
      </p>
      <button className="addButton" onClick={onAddNewAgent}>
        <IoAddCircleOutline className="addButtonIcon" />
        Add New {title}
      </button>
      </div>
    </div>
  );
};

export default EmptyMessage;

