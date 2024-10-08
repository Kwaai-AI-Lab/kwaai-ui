import { useEffect, useState } from "react";
import NavBar from "../navBar/navbar";
import { useAgents, AgentViewType } from "../../context/botsContext";
import Wizard from "../wizard/wizard";
import BotsGrid from "./botsGrid/botsGrid";
import AgentInteraction from "../agentInteraction/agentInteraction";
import SideBar from "../../components/sideBar/sideBar";
import PersonasWizard from "../wizard/personasWizard";
import ConfirmationModal from "../../components/confirmationModal";
import "./home.css";
import { Bot, Persona } from "../../data/types";
import useAssistants from "../../hooks/assistants.hook";
import usePersonas from "../../hooks/personas.hook";
import AssistantsService from "../../services/assistants.service";
import PersonasService from "../../services/personas.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const { setAgentViewType } = useAgents();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | Persona | null>(null);
  const [editBot, setEditBot] = useState<Bot | null>(null);
  const [editPersona, setEditPersona] = useState<Persona | null>(null);
  const [viewType, setViewType] = useState<AgentViewType>(AgentViewType.MyAgents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingViewType, setPendingViewType] = useState<AgentViewType | null>(null);
  const [localItems, setLocalItems] = useState<Array<Bot | Persona>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { assistants, loading: loadingAssistants, refetchAssistants } = useAssistants("assistant");
  const { personas, loading: loadingPersonas, refetchPersonas } = usePersonas();

  const assistantsCount = assistants.length;
  const personasCount = personas.length;

  useEffect(() => {
    setLoading(loadingAssistants || loadingPersonas);
  }, [loadingAssistants, loadingPersonas]);

  useEffect(() => {
    if (viewType === AgentViewType.MyAgents || viewType === AgentViewType.SharedAgents) {
      setLocalItems(assistants);
    } else if (viewType === AgentViewType.Personas) {
      setLocalItems(personas);
    }
  }, [viewType, assistants, personas]);

  const handleBotSelect = (bot: Bot | Persona) => {
    setSelectedBot(bot);
    console.log(bot);
  };

  const handleBotDelete = async (botId: string) => {
    try {
      if (viewType === AgentViewType.MyAgents || viewType === AgentViewType.SharedAgents) {
        await AssistantsService.deleteAssistant(botId);
        refetchAssistants();
      } else if (viewType === AgentViewType.Personas) {
        const personaInstance = new PersonasService();
        await personaInstance.deletePersona(botId);
        refetchPersonas();
      }
      setLocalItems((prevItems) => prevItems.filter((item) => item.id !== botId));
    } catch (error) {
      toast.error(`Error deleting bot: ${error}`);
    }
  };

  const handleBackToList = () => {
    setSelectedBot(null);
    setShowWizard(false);
  };

  const newAgentHandler = () => {
    setShowWizard(true);
    setEditBot(null);
    setEditPersona(null);
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

  const shouldShowSidebar = () => {
    if (assistantsCount === 0 && personasCount === 0 && !selectedBot && !showWizard) {
      return false;
    }
    return true;
  };

  return (
    <>
      <NavBar />
      <div className="mainContainer">
        <div className={`sidebar ${shouldShowSidebar() ? '' : 'hidden'}`}>
          <SideBar onItemClick={handleSideMenuItemClick} assistantsCount={assistantsCount} personasCount={personasCount} />
        </div>
        <div className="contentContainer" style={{ marginLeft: shouldShowSidebar() ? "295px" : "0" }}>
          {selectedBot ? (
            <AgentInteraction bot={selectedBot} onBack={handleBackToList} />
          ) : showWizard ? (
            viewType === AgentViewType.Personas ? (
              <PersonasWizard
                viewType={viewType}
                showList={handleBackToList}
                botToEdit={editPersona}
                refetchPersonas={refetchPersonas}
                setShowWizard={setShowWizard}
              />
            ) : (
              <Wizard
                viewType={viewType}
                showList={handleBackToList}
                botToEdit={editBot}
                setShowWizard={setShowWizard}
                refecthAssistants={refetchAssistants}
              />
            )
          ) : (
            <BotsGrid
              viewType={viewType}
              localItems={localItems}
              loading={loading}
              handleAddNewAgent={newAgentHandler}
              onBotSelect={handleBotSelect}
              onEditBot={viewType === AgentViewType.Personas ? handleEditPersona : handleEditBot}
              onBotDelete={handleBotDelete}
            />
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={handleCancelModal}
        onConfirm={handleConfirmModal}
      />

      <ToastContainer />
    </>
  );
}
