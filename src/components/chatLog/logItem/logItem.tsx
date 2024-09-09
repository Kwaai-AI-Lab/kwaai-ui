import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faArchive, faTrashCan, faShare, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { conversation } from "../../../data/types";
import "./logItem.css";

interface LogItemProps {
  item: conversation;
  isActive: boolean;
  logItemClickHandler: (item: conversation) => void;
  logItemClickConversationHandler: (item: conversation) => void;
  onChangeName: (item: conversation, newName: string) => void;
  onDelete: (item: conversation) => void;
}

const LogItem: React.FC<LogItemProps> = ({
  item,
  isActive,
  logItemClickHandler,
  logItemClickConversationHandler,
  onChangeName,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const toggleMenu = () => {
    logItemClickHandler(item);
  };

  const toggleGetConversation = () => {
    logItemClickConversationHandler(item);
  };

  const handleChangeName = () => {
    setIsEditing(true);
  };

  const handleSaveName = () => {
    console.log(item)
    onChangeName(item, newName);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      onDelete(item);
    }
  };

  return (
    <div className="logItemContent">
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleSaveName}
          onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
          className="editNameInput"
        />
      ) : (
        <span className="textContent" onClick={toggleGetConversation}>{item.name}</span>
      )}
      <FontAwesomeIcon icon={faEllipsis} className="ellipsisIcon" onClick={toggleMenu} />
      {isActive && (
        <div className="logItemMenu">
          <ul>
            <li onClick={handleChangeName}>
              <FontAwesomeIcon icon={faPenToSquare} className="menuIcon" />
              Change name
            </li>
            <li>
              <FontAwesomeIcon icon={faShare} className="menuIcon" />
              Share
            </li>
            <li>
              <FontAwesomeIcon icon={faArchive} className="menuIcon" />
              Archive
            </li>
            <li onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrashCan} className="menuIcon" />
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LogItem;
