import { useState } from "react";
import NavBar from "../navBar/navbar";
import { useAgents, AgentViewType } from "../../context/botsContext";
import Wizard from "../wizard/wizard";
import BotsGrid from "./botsGrid/botsGrid";
import AgentInteraction from "../agentInteraction/agentInteraction";
import SideBar from "../../components/sideBar/sideBar";
import ConfirmationModal from "../../components/confirmationModal"; // Import ConfirmationModal
import "./home.css";
import { Bot } from "../../data/types";

export default function Home() {
  const { myAgents, shareAgents, setAgentViewType } = useAgents();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [editBot, setEditBot] = useState<Bot | null>(null);
  const [viewType, setViewType] = useState<AgentViewType>(AgentViewType.MyAgents);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [pendingViewType, setPendingViewType] = useState<AgentViewType | null>(null); // State to store the viewType temporarily

  const newAgentHandler = () => {
    setShowWizard(true);
    setEditBot(null);
  };

  const handleBotSelect = (bot: Bot) => {
    setSelectedBot(bot);
  };

  const handleBackToList = () => {
    setSelectedBot(null);
    setShowWizard(false);
  };

  const handleSideMenuItemClick = (viewType: AgentViewType) => {
    if (showWizard) {
      setPendingViewType(viewType);
      setIsModalOpen(true);
    } else {
      proceedWithSideMenuItemClick(viewType);
    }
  };

  const proceedWithSideMenuItemClick = (viewType: AgentViewType) => {
    if (selectedBot) {
      handleBackToList();
    }
    if (showWizard) {
      setShowWizard(false);
    }
    setAgentViewType(viewType);
    setViewType(viewType);
  };

  const handleEditBot = (bot: Bot) => {
    setEditBot(bot);
    setShowWizard(true);
  };

  const agentsToShow = viewType === AgentViewType.MyAgents ? myAgents : shareAgents;

  const handleConfirmModal = () => {
    setIsModalOpen(false);
    if (pendingViewType !== null) {
      proceedWithSideMenuItemClick(pendingViewType);
      setPendingViewType(null);
    }
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setPendingViewType(null);
  };

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
            <Wizard showList={handleBackToList} botToEdit={editBot} setShowWizard={setShowWizard} />
          ) : (
            <BotsGrid bots={agentsToShow} handleAddNewAgent={newAgentHandler} onBotSelect={handleBotSelect} onEditBot={handleEditBot} />
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={handleCancelModal}
        onConfirm={handleConfirmModal}
      />
    </>
  );
}
