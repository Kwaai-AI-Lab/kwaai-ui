import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faArchive, faTrashCan, faShare, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { HistoryItem } from '../../../data/types';
import "./logItem.css";

const LogItem: React.FC<{ item: HistoryItem }> = ({ item }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setShowMenu(prev => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="logItemContent" onClick={toggleMenu}>
      <span className="textContent">{item.content}</span>
      <FontAwesomeIcon icon={faEllipsis} className="ellipsisIcon" />
      {showMenu && (
  <div className="logItemMenu" ref={menuRef} onClick={handleMenuClick}>
    <ul>
      <li onClick={() => setShowMenu(false)}>
        <FontAwesomeIcon icon={faPenToSquare} className="menuIcon" />
        Change name
      </li>
      <li onClick={() => setShowMenu(false)}>
        <FontAwesomeIcon icon={faShare} className="menuIcon" />
        Share
      </li>
      <li onClick={() => setShowMenu(false)}>
        <FontAwesomeIcon icon={faArchive} className="menuIcon" />
        Archive
      </li>
      <li onClick={() => setShowMenu(false)}>
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
