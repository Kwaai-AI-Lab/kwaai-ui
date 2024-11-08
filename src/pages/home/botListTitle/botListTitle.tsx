import { IoAddCircleOutline } from "react-icons/io5";
import "./botListTitle.css";
import { AgentViewType } from "../../../context/botsContext";
import { useEffect, useState } from "react";

interface BotListTitleProps {
    onAddNewAgent: () => void;
    viewType: AgentViewType;
}


const BotListTitle: React.FC<BotListTitleProps> = ({viewType, onAddNewAgent }) => {
const [title, setTitle] = useState<string>("Assistant");

  useEffect(() => {
      if (viewType === AgentViewType.MyAgents) {
        setTitle("Assistant");
      } else if (viewType === AgentViewType.Personas) {
        setTitle("Persona");
      } else if (viewType === AgentViewType.SharedAgents) {
        setTitle("Shared Assistant");
      }
    }, [viewType]);


    return (
        <div className="titleContainer">
          <span className="title">{title} Catalogue</span>
          {viewType === AgentViewType.MyAgents || viewType === AgentViewType.Personas ? (
            <button className="addButton" onClick={onAddNewAgent}>
              <IoAddCircleOutline className="addButtonIcon" />
              Add New {title}
            </button> ) : null
            }
        </div>
      );
}

export default BotListTitle;