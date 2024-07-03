import React from "react";
import { HistoryLog } from "../../data/types";
import LogGroup from "./logGroup/logGroup";
import "./chatLog.css";

interface ChatLogProps {
  historyLogs: HistoryLog[];
}

const ChatLog: React.FC<ChatLogProps> = ({ historyLogs }) => {
  return (
    <div className="logGroupContainer">
      {historyLogs.map((group) => (
        <LogGroup key={group.title} group={group} />
      ))}
    </div>
  );
};

export default ChatLog;
