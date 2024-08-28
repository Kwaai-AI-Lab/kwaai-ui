import BotItem from "../botItem/botItem";
import BotListTitle from "../botListTitle/botListTitle";
import EmptyMessage from "../../../components/emptyMessage/emptyMessage";
import { Bot } from "../../../data/types";
import { useState, useEffect } from "react";
import "./botsGrid.css";
import useAssistants from "../../../hooks/assistants.hook";
import { DotLoader } from "react-spinners";

interface BotsGridProps {
  bots: Bot[];
  handleAddNewAgent: () => void;
  onBotSelect: (bot: Bot) => void;
  onEditBot: (bot: Bot) => void;
}

const BotsGrid: React.FC<BotsGridProps> = ({ handleAddNewAgent, onBotSelect, onEditBot }) => {
  const { assistants } = useAssistants("assistant");
  const [localBots, setLocalBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assistants.length > 0) {
      setLocalBots(assistants);
      setLoading(false);
    }
  }, [assistants]);

  const handleBotDelete = (botId: string) => {
    setLocalBots((prevBots) => prevBots.filter((bot) => bot.id !== botId));
  };

  return (
    <>
      <BotListTitle onAddNewAgent={handleAddNewAgent} />
      {loading ? (
        <div className="loader-container">
          <DotLoader color="#5967F1" size={60} />
        </div>
      ) : localBots.length === 0 ? (
        <EmptyMessage />
      ) : (
        <div className="botsListGrid">
          {localBots.map((bot) => (
            <BotItem
              key={bot.id}
              botItemData={bot}
              onBotSelect={onBotSelect}
              onEditBot={onEditBot}
              onBotDelete={handleBotDelete}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BotsGrid;
