import React from "react";
import { Bot } from "../../data/types";
import backIcon from "../../assets/back-button-icon.png";
import Chat from "../../components/chat/chat"; 
import "./agentInteraction.css";

interface AgentInteractionProps {
  bot: Bot;
  onBack: () => void;
}

const AgentInteraction: React.FC<AgentInteractionProps> = ({ bot, onBack }) => {
  return (
    <div className="agentInteractionContainer">
      <div className="headerInteractionContainer">
        <button onClick={onBack} className="backButton">
          <img src={backIcon} alt="Back" className="backIcon" />
        </button>
        <h1 className="botName">{bot.name}</h1>
        <p className="additionalText">CS-346</p>
      </div>
      <div className="bodyInteractionContainer">
        <div className="leftContent">
          <Chat />
        </div>
        <div className="rightContent">Right Content</div>
      </div>
    </div>
  );
};

export default AgentInteraction;
