import BotItem from "../botItem/botItem";
import BotListTitle from "../botListTitle/botListTitle";
import EmptyMessage from "../../../components/emptyMessage/emptyMessage";
import { Bot } from "../../../data/types";
import { useState, useEffect } from "react";
import "./botsGrid.css";
import useAssistants from "../../../hooks/assistants.hook";

interface BotsGridProps {
  bots: Bot[];
  handleAddNewAgent: () => void;
  onBotSelect: (bot: Bot) => void;
  onEditBot: (bot: Bot) => void; // Add new prop for handling edit
}

const BotsGrid: React.FC<BotsGridProps> = ({ bots, handleAddNewAgent, onBotSelect, onEditBot }) => {
  const [error, setError] = useState<string | null>(null);
  const { assistants } = useAssistants("assistant");

  const botsToRender = assistants.length > 0 ? assistants : bots;

  return (
    <>
      <BotListTitle onAddNewAgent={handleAddNewAgent} />
      {botsToRender.length === 0 ? (
        <EmptyMessage />
      ) : (
        <div className="botsListGrid">
          {botsToRender.map((bot) => (
            <BotItem key={bot.id} botItemData={bot} onBotSelect={onBotSelect} onEditBot={onEditBot} />
          ))}
        </div>
      )}
    </>
  );
};

export default BotsGrid;
