import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faArchive, faTrashCan, faShare, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { HistoryItem } from "../../../data/types";
import "./logItem.css";

interface LogItemProps {
  item: HistoryItem;
  isActive: boolean;
  logItemClickHandler: (item: HistoryItem) => void; // Add setClickedLogId prop
}

const LogItem: React.FC<LogItemProps> = ({ item, isActive, logItemClickHandler }) => {
  const toggleMenu = () => {
    logItemClickHandler(item); // Set the clicked log ID
  };


  return (
    <div className="logItemContent" onClick={toggleMenu}>
      <span className="textContent">{item.content}</span>
      <FontAwesomeIcon icon={faEllipsis} className="ellipsisIcon" />
      {isActive && (
        <div className="logItemMenu">
          <ul>
            <li>
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
            <li>
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
