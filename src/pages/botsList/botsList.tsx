import { useState } from "react";
import NavBar from "../navBar/navbar";
import { useBots } from "../../context/botsContext";
import Wizard from "../wizard/wizard";
import BotsGrid from "./botsGrid/botsGrid";
import AgentInteraction from "../agentInteraction/agentInteraction"; // Import the new component
import "./botsList.css";
import { Bot } from "../../data/types";

export default function BotsList() {
  const { bots } = useBots();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null); // State to track selected bot

  const toggleWizard = () => {
    setShowWizard((prevState) => !prevState);
  };

  const handleBotSelect = (bot: Bot) => {
    setSelectedBot(bot);
  };

  const handleBackToList = () => {
    setSelectedBot(null);
  };

  return (
    <>
      <NavBar />
      <div className="mainContainer">
        <div className="sidebar"></div>
        <div className="contentContainer">
          {selectedBot ? (
            <AgentInteraction bot={selectedBot} onBack={handleBackToList} />
          ) : showWizard ? (
            <Wizard showList={toggleWizard} />
          ) : (
            <BotsGrid bots={bots} handleAddNewAgent={toggleWizard} onBotSelect={handleBotSelect} />
          )}
        </div>
      </div>
    </>
  );
}