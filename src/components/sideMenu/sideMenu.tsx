import React, { useState, useEffect } from "react";
import SideMenuItem from "./sideMenuItem/sideMenuItem";
import agentIcon from "../../assets/agent-icon.png";
import UserIcon from "../../assets/user-regular.svg";
import "./sideMenu.css";
import { AgentViewType } from "../../context/botsContext";

interface SideMenuProps {
  onItemClick: (viewType: AgentViewType) => void;
  viewType: AgentViewType | null;
}

const menuItems = [
  { text: "My assistant", imageSrc: agentIcon, viewType: AgentViewType.MyAgents },
  { text: "Shared assistants", imageSrc: agentIcon, viewType: AgentViewType.SharedAgents },
  { text: "Personas", imageSrc: UserIcon, viewType: AgentViewType.Personas },
];

const SideMenu: React.FC<SideMenuProps> = ({ onItemClick, viewType }) => {
  const [selectedItem, setSelectedItem] = useState<AgentViewType | null>(viewType);

  useEffect(() => {
    setSelectedItem(viewType);
  }, [viewType]);

  const handleItemClick = (itemViewType: AgentViewType) => {
    onItemClick(itemViewType);
  };

  return (
    <div className="sideMenu-container">
      {menuItems.map((item, index) => (
        <SideMenuItem 
          key={index} 
          text={item.text} 
          imageSrc={item.imageSrc} 
          onClick={() => handleItemClick(item.viewType)}
          selected={selectedItem === item.viewType}
        />
      ))}
    </div>
  );
};

export default SideMenu;
