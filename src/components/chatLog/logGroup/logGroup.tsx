import React from "react";
import { conversation, ConversationGroup } from "../../../data/types";
import LogItem from "../logItem/logItem";
import "./logGroup.css";

interface LogGroupProps {
  group: ConversationGroup;
  selectedItemId: string | null;
  logItemClickHandler: (item: conversation) => void;
  logItemClickConversationHandler: (item: conversation) => void;
  onChangeName: (item: conversation, newName: string) => void;
  onDelete: (item: conversation) => void;
}

const LogGroup: React.FC<LogGroupProps> = ({
  group,
  selectedItemId,
  logItemClickHandler,
  logItemClickConversationHandler,
  onChangeName,
  onDelete,
}) => (
  <div className="logGroup">
    <div className="logGroupTitle">{group.title}</div>
    {group.conversations.map((log) => (
      <LogItem
        key={log.id}
        item={log}
        isActive={selectedItemId === log.id}
        logItemClickHandler={logItemClickHandler}
        logItemClickConversationHandler={logItemClickConversationHandler}
        onChangeName={onChangeName}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default LogGroup;
