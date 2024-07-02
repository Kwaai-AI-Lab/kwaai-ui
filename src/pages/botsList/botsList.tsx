import React, { useState } from "react";
import NavBar from "../navBar/navbar.tsx";
import { useBots } from "../../context/botsContext.tsx";
import Wizard from "../wizard/wizard.tsx";
import "./botsList.css";
import "./botItem/botItem.css";
import BotsGrid from "./botsGrid/botsGrid.tsx";

export default function BotsList() {
  const { bots } = useBots();
  const [showWizard, setShowWizard] = useState(false);

  const toggleWizard = () => {
    setShowWizard(prevState => !prevState);
  };

  return (
    <>
      <NavBar />
      <div className="mainContainer">
        <div className="sidebar"></div>
        <div className="contentContainer">
          {showWizard ? <Wizard showList={toggleWizard} /> : <BotsGrid bots={bots} handleAddNewAgent={toggleWizard} /> }
        </div>
      </div>
    </>
  );
}
