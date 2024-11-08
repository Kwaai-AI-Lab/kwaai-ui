import BotItem from "../botItem/botItem";
import BotListTitle from "../botListTitle/botListTitle";
import EmptyMessage from "../../../components/emptyMessage/emptyMessage";
import { Bot, Persona } from "../../../data/types";
import { useState, useEffect } from "react";
import "./botsGrid.css";
import useAssistants from "../../../hooks/assistants.hook";
import useSharedAssistants from "../../../hooks/sharedAssistants.hook";
import { DotLoader } from "react-spinners";
import usePersonas from "../../../hooks/personas.hook";
import { AgentViewType } from "../../../context/botsContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssistantsService from "../../../services/assistants.service";
import PersonasService from "../../../services/personas.service";

interface BotsGridProps {
  viewType: AgentViewType;
  handleAddNewAgent: () => void;
  onBotSelect: (bot: Bot | Persona) => void;
  onEditBot: (bot: Bot | Persona) => void;
}

const BotsGrid: React.FC<BotsGridProps> = ({ viewType, handleAddNewAgent, onBotSelect, onEditBot }) => {
  const { assistants, loading: loadingAssistants, refetchAssistants } = useAssistants("assistant");
  const { sharedAssistants, loading: loadingSharedAssistants, refetchSharedAssistants } = useSharedAssistants();
  const { personas, loading: loadingPersonas, refetchPersonas } = usePersonas();
  const [localItems, setLocalItems] = useState<Array<Bot | Persona>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(
      viewType === AgentViewType.SharedAgents
        ? loadingSharedAssistants
        : loadingAssistants || loadingPersonas
    );
  }, [loadingAssistants, loadingSharedAssistants, loadingPersonas, viewType]);

  useEffect(() => {
    if (viewType === AgentViewType.MyAgents) {
      setLocalItems(assistants);
    } else if (viewType === AgentViewType.SharedAgents) {
      setLocalItems(sharedAssistants);
    } else if (viewType === AgentViewType.Personas) {
      setLocalItems(personas);
    }
  }, [viewType, assistants, sharedAssistants, personas]);

  const handleError = (message: string) => {
    toast.error(message);
  };

  const canCreateAgent = () => {
    return (viewType === AgentViewType.MyAgents || viewType === AgentViewType.SharedAgents) && personas.length === 0;
  };

  const handleBotDelete = async (botId: string) => {
    try {
      if (viewType === AgentViewType.MyAgents || viewType === AgentViewType.SharedAgents) {
        await AssistantsService.deleteAssistant(botId);
        refetchAssistants();
        if (viewType === AgentViewType.SharedAgents) {
          refetchSharedAssistants();
        }
      } else if (viewType === AgentViewType.Personas) {
        await PersonasService.deletePersona(botId);
        refetchPersonas();
      }

      setLocalItems((prevItems) => prevItems.filter((item) => item.id !== botId));
    } catch (error) {
      handleError(`Error deleting bot: ${error}`);
    }
  };

  console.log("BotsGrid.tsx", localItems);

  return (
    <>
      <ToastContainer />
      <BotListTitle 
        viewType={viewType} 
        onAddNewAgent={() => {
          if (canCreateAgent()) {
            toast.error("Cannot create an assistant: please create a persona first");
          } else {
            handleAddNewAgent();
          }
        }} 
      />
      {loading ? (
        <div className="loader-container">
          <DotLoader color="#5967F1" size={60} />
        </div>
      ) : localItems.length === 0 ? (
        <EmptyMessage />
      ) : (
        <div className="botsListGrid">
          {localItems.map((item) => (
            <BotItem
              key={item.id}
              botItemData={item}
              onBotSelect={onBotSelect}
              onEditBot={onEditBot}
              onBotDelete={handleBotDelete}
              onError={handleError}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BotsGrid;
