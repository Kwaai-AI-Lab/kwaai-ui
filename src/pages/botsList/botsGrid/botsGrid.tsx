import React from 'react';
import BotItem from "../botItem/botItem.tsx";
import BotListTitle from "../botListTitle/botListTitle.tsx";
import EmptyMessage from "../../../components/emptyMessage/emptyMessage.tsx";
import { Bot } from "../../../data/types";
import "./botsGrid.css";

interface BotsGridProps {
    bots: Bot[];
    handleAddNewAgent: () => void;
}  

const BotsGrid: React.FC<BotsGridProps> = ({ bots, handleAddNewAgent }) => {
  return (
    <>
      <BotListTitle onAddNewAgent={handleAddNewAgent} />
      {bots.length === 0 ? (
        <EmptyMessage />
      ) : (
        <div className="botsListGrid">
          {bots.map((bot) => (
            <BotItem key={bot.id} botItemData={bot} />
          ))}
        </div>
      )}
    </>
  );
};

export default BotsGrid;
