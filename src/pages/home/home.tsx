import { useState } from "react";
import NavBar from "../navBar/navbar";
import { useAgents, AgentViewType } from "../../context/botsContext";
import Wizard from "../wizard/wizard";
import BotsGrid from "./botsGrid/botsGrid";
import AgentInteraction from "../agentInteraction/agentInteraction";
import SideBar from "../../components/sideBar/sideBar";
import "./home.css";
import { Bot } from "../../data/types";

export default function Home() {
  const { myAgents, shareAgents, setAgentViewType } = useAgents();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [editBot, setEditBot] = useState<Bot | null>(null); // New state to track bot being edited
  const [viewType, setViewType] = useState<AgentViewType>(AgentViewType.MyAgents);

  const newAgentHandler = () => {
    setShowWizard(true);
    setEditBot(null); // Reset editBot when creating a new agent
  };

  const handleBotSelect = (bot: Bot) => {
    setSelectedBot(bot);
  };

  const handleBackToList = () => {
    setSelectedBot(null);
    setShowWizard(false); // Ensure to update this state to close the wizard
  };

  const handleSideMenuItemClick = (viewType: AgentViewType) => {
    setAgentViewType(viewType);
    setViewType(viewType);
  };

  const handleEditBot = (bot: Bot) => {
    setEditBot(bot);
    setShowWizard(true);
  };

  const agentsToShow = viewType === AgentViewType.MyAgents ? myAgents : shareAgents;

  return (
    <>
      <NavBar />
      <div className="mainContainer">
        <div className="sidebar">
          <SideBar onItemClick={handleSideMenuItemClick} />
        </div>
        <div className="contentContainer">
          {selectedBot ? (
            <AgentInteraction bot={selectedBot} onBack={handleBackToList} />
          ) : showWizard ? (
            <Wizard showList={handleBackToList} botToEdit={editBot} setShowWizard={setShowWizard} /> // Pass setShowWizard to Wizard
          ) : (
            <BotsGrid bots={agentsToShow} handleAddNewAgent={newAgentHandler} onBotSelect={handleBotSelect} onEditBot={handleEditBot} />
          )}
        </div>
      </div>
    </>
  );
}
