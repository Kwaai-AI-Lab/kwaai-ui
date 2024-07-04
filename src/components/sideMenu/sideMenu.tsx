import React, { useState } from "react";
import SideMenuItem from "./sideMenuItem/sideMenuItem";
import agentIcon from "../../assets/agent-icon.png";
import "./sideMenu.css";
import { AgentViewType } from "../../context/botsContext";

interface SideMenuProps {
    onItemClick: (viewType: AgentViewType) => void;
}

const menuItems = [
    { text: "My assistant", imageSrc: agentIcon, viewType: AgentViewType.MyAgents },
    { text: "Shared assistants", imageSrc: agentIcon, viewType: AgentViewType.SharedAgents }
];

const SideMenu: React.FC<SideMenuProps> = ({ onItemClick }) => {
    const [selectedItem, setSelectedItem] = useState<AgentViewType | null>(null);

    const handleItemClick = (viewType: AgentViewType) => {
        setSelectedItem(viewType);
        onItemClick(viewType);
    };

    return (
        <div className="sideMenu-container">
            {menuItems.map((item, index) => (
                <SideMenuItem 
                    key={index} 
                    text={item.text} 
                    imageSrc={item.imageSrc} 
                    onClick={() => handleItemClick(item.viewType)} 
                    selected={selectedItem === item.viewType}  // Pass selected status
                />
            ))}
        </div>
    );
}

export default SideMenu;
