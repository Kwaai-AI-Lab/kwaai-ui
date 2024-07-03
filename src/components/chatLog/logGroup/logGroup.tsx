import React from "react";
import { HistoryLog } from "../../../data/types";
import LogItem from "../logItem/logItem";
import "./logGroup.css";

interface LogGroupProps {
  group: HistoryLog;
}

const LogGroup: React.FC<LogGroupProps> = ({ group }) => (
  <div className="logGroup">
    <div className="logGroupTitle">{group.title}</div>
    {group.logs.map((log) => (
      <LogItem key={log.id} item={log} />
    ))}
  </div>
);

export default LogGroup;
