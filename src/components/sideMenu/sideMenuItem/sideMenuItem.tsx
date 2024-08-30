import React from "react";
import "./sideMenuItem.css";

interface SideMenuItemProps {
    text: string;
    imageSrc: string;
    onClick: () => void;
    selected: boolean;
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({ text, imageSrc, onClick, selected }) => {
    return (
        <div className={`sideMenuItem-container ${selected ? 'selected' : ''}`} onClick={onClick}>
            <img src={imageSrc} alt="icon" className="sideMenuItem-image" />
            <div className="sideMenuItem-text">{text}</div>
        </div>
    );
}

export default SideMenuItem;
