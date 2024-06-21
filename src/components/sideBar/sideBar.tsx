import React from "react";
import SideMenu from "../sideMenu/sideMenu";
import "./sideBar.css";
import { AgentViewType } from "../../context/botsContext";

interface SideBarProps {
    onItemClick: (viewType: AgentViewType) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onItemClick }) => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-top"></div>
            <div className="sidebar-bottom">
                <SideMenu onItemClick={onItemClick} />
            </div>
        </div>
    );
}

export default SideBar;
