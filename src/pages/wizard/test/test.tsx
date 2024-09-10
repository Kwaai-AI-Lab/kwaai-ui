import React from "react";
import Chat from "../../../components/chat/chat";
import "./test.css";

interface testProps {
  handleMessage: (inputValue:string) => Promise<string>;
}

const Test: React.FC <testProps> = ({handleMessage}) => {
  return (
    <div className="test-container">
      <Chat handleMessage={handleMessage} messages={[]} />
    </div>
  );
};

export default Test;
