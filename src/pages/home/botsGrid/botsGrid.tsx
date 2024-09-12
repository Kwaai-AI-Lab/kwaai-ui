import BotItem from "../botItem/botItem";
import BotListTitle from "../botListTitle/botListTitle";
import EmptyMessage from "../../../components/emptyMessage/emptyMessage";
import { Bot, Persona } from "../../../data/types";
import { useState, useEffect } from "react";
import "./botsGrid.css";
import useAssistants from "../../../hooks/assistants.hook";
import { DotLoader } from "react-spinners";
import usePersonas from "../../../hooks/personas.hook";
import { AgentViewType } from "../../../context/botsContext";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BotsGridProps {
  viewType: AgentViewType;
  bots: Bot[] | Persona[];
  handleAddNewAgent: () => void;
  onBotSelect: (bot: Bot) => void;
  onEditBot: (bot: Bot | Persona) => void;
}

const BotsGrid: React.FC<BotsGridProps> = ({ viewType, handleAddNewAgent, onBotSelect, onEditBot }) => {
  const { assistants } = useAssistants("assistant");
  const { personas } = usePersonas();
  const [localItems, setLocalItems] = useState<Array<Bot | Persona>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assistants.length > 0 || personas.length > 0) {
      setLocalItems([...assistants, ...personas]);
      setLoading(false);
    }
  }, [assistants, personas]);

  const handleError = (message: string) => {
    toast.error(message);
  };

  useEffect(() => {
    if (viewType === AgentViewType.MyAgents || viewType === AgentViewType.SharedAgents) {
      setLocalItems(assistants);
    } else if (viewType === AgentViewType.Personas) {
      setLocalItems(personas);
    }
  }, [viewType, assistants, personas]);

  const handleBotDelete = (botId: string) => {
    setLocalItems((prevItems) => prevItems.filter((item) => item.id !== botId));
  };

  return (
    <>
      <ToastContainer/>
      <BotListTitle viewType={viewType} onAddNewAgent={handleAddNewAgent} />
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
