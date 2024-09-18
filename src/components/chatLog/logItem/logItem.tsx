import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faArchive, faTrashCan, faShare, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { conversation } from "../../../data/types";
import "./logItem.css";

interface LogItemProps {
  item: conversation;
  logItemClickConversationHandler: (item: conversation) => void;
  onChangeName: (item: conversation, newName: string) => void;
  onDelete: (item: conversation) => void;
  isActive?: boolean;
  logItemClickHandler: (item: conversation) => void;
}

const LogItem: React.FC<LogItemProps> = ({
  item,
  logItemClickConversationHandler,
  onChangeName,
  onDelete,
  isActive,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const toggleGetConversation = () => {
    if (isActive) {
      return; // No hace nada si está activa
    }
    logItemClickConversationHandler(item);
  };

  const handleChangeName = () => {
    setIsEditing(true);
  };

  const handleSaveName = () => {
    onChangeName(item, newName);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      onDelete(item);
    }
  };

  return (
    <div className={`logItemContent ${isActive ? "active" : ""}`}>
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
        <span className="textContent" onClick={toggleGetConversation}>
          {item.name}
        </span>
      )}
      <FontAwesomeIcon icon={faEllipsis} className="ellipsisIcon" onClick={toggleMenu} />
      {isMenuVisible && (
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
