import { HistoryLog, HistoryItem } from "../../data/types";
import LogGroup from "./logGroup/logGroup";
import "./chatLog.css";
import { useState } from "react";

interface ChatLogProps {
  historyLogs: HistoryLog[];
}

const ChatLog: React.FC<ChatLogProps> = ({ historyLogs }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const logItemClickHandler = (item: HistoryItem) => {
    if (selectedItemId === item.id) {
      setSelectedItemId(null);
      return;
    }
    setSelectedItemId(item.id);
  }

  
  return (
    <div className="logGroupContainer">
      {historyLogs.map((group) => (
        <LogGroup
          key={group.title}
          group={group}
          selectedItemId={selectedItemId}
          logItemClickHandler={logItemClickHandler} // Pass setClickedLogId to LogGroup
        />
      ))}
    </div>
  );
};

export default ChatLog;
