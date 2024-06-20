import BotItem from "../botItem/botItem";
import BotListTitle from "../botListTitle/botListTitle";
import EmptyMessage from "../../../components/emptyMessage/emptyMessage";
import { Bot } from "../../../data/types";
import "./botsGrid.css";

interface BotsGridProps {
    bots: Bot[];
    handleAddNewAgent: () => void;
    onBotSelect: (bot: Bot) => void; // Add this prop
}

const BotsGrid: React.FC<BotsGridProps> = ({ bots, handleAddNewAgent, onBotSelect }) => {
  return (
    <>
      <BotListTitle onAddNewAgent={handleAddNewAgent} />
      {bots.length === 0 ? (
        <EmptyMessage />
      ) : (
        <div className="botsListGrid">
          {bots.map((bot) => (
            <BotItem key={bot.id} botItemData={bot} onBotSelect={onBotSelect} />
          ))}
        </div>
      )}
    </>
  );
};

export default BotsGrid;