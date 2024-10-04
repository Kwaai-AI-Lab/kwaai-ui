import React from "react";
import SideMenu from "../sideMenu/sideMenu";
import "./sideBar.css";
import kwaaiLogo from "../../assets/kwaai-logo.svg";
import { AgentViewType } from "../../context/botsContext";

interface SideBarProps {
    onItemClick: (viewType: AgentViewType) => void;
    assistantsCount: number;
    personasCount: number;
}

const SideBar: React.FC<SideBarProps> = ({ onItemClick, assistantsCount, personasCount }) => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-top">
                <img src={kwaaiLogo} alt="Kwaai Logo" />
            </div>
            <div className="sidebar-bottom">
                <SideMenu onItemClick={onItemClick} assistantsCount={assistantsCount} personasCount={personasCount} />
            </div>
        </div>
    );
}

export default SideBar;
