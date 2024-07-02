import React from "react";
import Chat from "../../../components/chat/chat"; // Import the Chat component
import "./test.css";  // Import the CSS file

const Test: React.FC = () => {
  return (
    <div className="test-container">
      <Chat />
    </div>
  );
};

export default Test;
