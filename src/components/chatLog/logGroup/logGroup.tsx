import React from "react";
import { HistoryLog, HistoryItem } from "../../../data/types";
import LogItem from "../logItem/logItem";
import "./logGroup.css";

interface LogGroupProps {
  group: HistoryLog;
  selectedItemId: string | null;
  logItemClickHandler: (item: HistoryItem) => void;
}

const LogGroup: React.FC<LogGroupProps> = ({
  group,
  selectedItemId,
  logItemClickHandler,
}) => (
  <div className="logGroup">
    <div className="logGroupTitle">{group.title}</div>
    {group.logs.map((log) => (
      <LogItem
        key={log.id}
        item={log}
        isActive = {selectedItemId === log.id}
        logItemClickHandler={logItemClickHandler} 
      />
    ))}
  </div>
);

export default LogGroup;
