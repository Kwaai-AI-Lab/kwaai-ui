import React, { useState } from "react";
import SideMenuItem from "./sideMenuItem/sideMenuItem";
import AgentIcon from "../../assets/agent-icon.svg"
import UserIcon from "../../assets/user-regular.svg";
import "./sideMenu.css";
import { AgentViewType } from "../../context/botsContext";

interface SideMenuProps {
  onItemClick: (viewType: AgentViewType) => void;
  assistantsCount: number;
  personasCount: number;
}

const menuItems = [
  { text: "My assistant", imageSrc: AgentIcon, viewType: AgentViewType.MyAgents },
  { text: "Shared assistants", imageSrc: AgentIcon, viewType: AgentViewType.SharedAgents },
  { text: "Personas", imageSrc: UserIcon, viewType: AgentViewType.Personas },
];

const SideMenu: React.FC<SideMenuProps> = ({ onItemClick, assistantsCount, personasCount }) => {
  const [selectedItem, setSelectedItem] = useState<AgentViewType | null>(null);

  const handleItemClick = (itemViewType: AgentViewType) => {
    onItemClick(itemViewType);
    setSelectedItem(itemViewType);
  };

  return (
    <div className="sideMenu-container">
      {menuItems.map((item, index) => (
        <SideMenuItem 
          key={index} 
          text={item.text} 
          imageSrc={item.imageSrc}
          count={item.viewType === AgentViewType.Personas ? personasCount : assistantsCount} 
          onClick={() => handleItemClick(item.viewType)}
          selected={selectedItem === item.viewType}
        />
      ))}
    </div>
  );
};

export default SideMenu;
