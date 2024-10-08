import React, { useState } from "react";
import SideMenuItem from "./sideMenuItem/sideMenuItem";
import AgentIcon from "../../assets/agent-icon.svg";
import UserIcon from "../../assets/user-regular.svg";
import "./sideMenu.css";
import { AgentViewType } from "../../context/botsContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleItemClick = (itemViewType: AgentViewType, isDisabled: boolean) => {
    if (isDisabled) {
      toast.error("You need to create a persona first.");
    } else {
      onItemClick(itemViewType);
      setSelectedItem(itemViewType);
    }
  };

  return (
    <div className="sideMenu-container">
      {menuItems.map((item, index) => {
        const isDisabled = personasCount === 0 && item.viewType !== AgentViewType.Personas;
        const itemCount = item.viewType === AgentViewType.Personas ? personasCount : assistantsCount;

        return (
          <SideMenuItem
            key={index}
            text={item.text}
            imageSrc={item.imageSrc}
            count={itemCount}
            onClick={() => handleItemClick(item.viewType, isDisabled)}
            selected={selectedItem === item.viewType}
          />
        );
      })}
      <ToastContainer />
    </div>
  );
};

export default SideMenu;
