import BotItem from "../botItem/botItem";
import BotListTitle from "../botListTitle/botListTitle";
import EmptyMessage from "../../../components/emptyMessage/emptyMessage";
import { Bot, Persona } from "../../../data/types";
import "./botsGrid.css";
import { DotLoader } from "react-spinners";
import { AgentViewType } from "../../../context/botsContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BotsGridProps {
  viewType: AgentViewType;
  handleAddNewAgent: () => void;
  onBotSelect: (bot: Bot | Persona) => void;
  onEditBot: (bot: Bot | Persona) => void;
  localItems: Array<Bot | Persona>;
  loading: boolean;
  onBotDelete: (botId: string) => void;
}

const BotsGrid: React.FC<BotsGridProps> = ({ 
  viewType, 
  handleAddNewAgent, 
  onBotSelect, 
  onEditBot, 
  localItems, 
  loading, 
  onBotDelete 
}) => {

  const canCreateAgent = () => {
    return (viewType === AgentViewType.MyAgents || viewType === AgentViewType.SharedAgents) && localItems.length === 0;
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="loader-container">
          <DotLoader color="#045CE2" size={60} />
        </div>
      ) : localItems.length === 0 ? (
        <EmptyMessage onAddNewAgent={handleAddNewAgent} viewType={viewType}/>
      ) : (
        <div className="botsGridWrapper">
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
          <div className="botsListGrid">
            {localItems.map((item) => (
              <BotItem
                key={item.id}
                onError={() => toast.error("Error deleting bot")}
                botItemData={item}
                onBotSelect={onBotSelect}
                onEditBot={onEditBot}
                onBotDelete={onBotDelete}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BotsGrid;
