import React from "react";
import "./sideMenuItem.css";

interface SideMenuItemProps {
    text: string;
    imageSrc: string;
    count: number;
    onClick: () => void;
    selected: boolean;
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({ text, imageSrc, count, onClick, selected }) => {
    return (
        <div className={`sideMenuItem-container ${selected ? 'selected' : ''}`} onClick={onClick}>
            <img src={imageSrc} alt="icon" className="sideMenuItem-image" />
            <div className="sideMenuItem-text">{text}</div>
            <div className="sideMenuItem-count">{count}</div>
        </div>
    );
}

export default SideMenuItem;
