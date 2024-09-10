import { useState } from "react";
import NavBar from "../navBar/navbar";
import { useAgents, AgentViewType } from "../../context/botsContext";
import Wizard from "../wizard/wizard";
import BotsGrid from "./botsGrid/botsGrid";
import AgentInteraction from "../agentInteraction/agentInteraction";
import SideBar from "../../components/sideBar/sideBar";
import PersonasWizard from "../wizard/personasWizard"; // Ensure correct import capitalization
import ConfirmationModal from "../../components/confirmationModal";
import "./home.css";
import { Bot, Persona } from "../../data/types";

export default function Home() {
  const { myAgents, personas, shareAgents, setAgentViewType } = useAgents();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [editBot, setEditBot] = useState<Bot | null>(null);
  const [editPersona, setEditPersona] = useState<Persona | null>(null);
  const [viewType, setViewType] = useState<AgentViewType>(AgentViewType.MyAgents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingViewType, setPendingViewType] = useState<AgentViewType | null>(null);

  const newAgentHandler = () => {
    setShowWizard(true);
    setEditBot(null);
    setEditPersona(null);
  };

  const handleBotSelect = (bot: Bot) => {
    setSelectedBot(bot);
    console.log(bot);
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
    setEditPersona(null);
    setShowWizard(true);
  };

  const handleEditPersona = (persona: Persona) => {
    setEditPersona(persona);
    setEditBot(null);
    setShowWizard(true);
  };

  const agentsToShow = viewType === AgentViewType.MyAgents
    ? myAgents
    : viewType === AgentViewType.Personas
    ? personas
    : shareAgents;

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
            viewType === AgentViewType.Personas ? (
              <PersonasWizard
                viewType={viewType}
                showList={handleBackToList}
                botToEdit={editPersona}
                setShowWizard={setShowWizard}
              />
            ) : (
              <Wizard
                viewType={viewType}
                showList={handleBackToList}
                botToEdit={editBot}
                setShowWizard={setShowWizard}
              />
            )
          ) : (
        <BotsGrid
          viewType={viewType}
          bots={agentsToShow}
          handleAddNewAgent={newAgentHandler}
          onBotSelect={handleBotSelect}
          onEditBot={viewType === AgentViewType.Personas ? handleEditPersona : handleEditBot}
        />
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
