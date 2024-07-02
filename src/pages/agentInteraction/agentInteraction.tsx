import React, { useState } from "react";
import { Bot } from "../../data/types";
import backIcon from "../../assets/back-button-icon.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import Chat from "../../components/chat/chat";
import ChatLog from "../../components/chatLog/chatLog";
import { useAgents } from "../../context/botsContext";
import "./agentInteraction.css";

interface AgentInteractionProps {
  bot: Bot;
  onBack: () => void;
}

const AgentInteraction: React.FC<AgentInteractionProps> = ({ bot, onBack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const { historyLog } = useAgents();

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Add logic to handle the mute/unmute functionality here
  };

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
        <div className="rightContent">
          <div className="imageContainer">
            <img src={bot.img} alt="Bot" className="botImage" />
            <button onClick={toggleMute} className="muteButton">
              <FontAwesomeIcon icon={isMuted ? faVolumeUp : faVolumeMute} className="muteIcon" />
            </button>
          </div>
          <div className="historyContent">
            <ChatLog historyLogs={historyLog} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentInteraction;
