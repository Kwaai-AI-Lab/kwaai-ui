import React, { useState } from "react";
import "./chat.css";
import ChatMessage from "./chatMessage/chatMessage";  
import PrimaryButton from "../buttons/primaryButton/primaryButton"; 
import { Message } from "../../data/types";
import { DotLoader } from "react-spinners";

interface MessageLocal {
  sender: "user" | "ai";
  text: string;
}

interface chatProps {
  handleMessage: (inputValue:string) => Promise<Message | "" >;
}

const Chat: React.FC <chatProps> = ({handleMessage}) => {
  const [messages, setMessages] = useState<MessageLocal[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (inputValue.trim() === "") {
      return;
    }
    
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: inputValue }
    ]);
    
    setInputValue("");
    setLoading(true);
    
    const message = await handleMessage(inputValue);
    
    if (message) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: message.chat_response }
      ]);
    }
    
    setLoading(false);
  };
  

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            sender={message.sender}
            text={message.text}
          />
        ))}
        {loading && (
          <DotLoader color="#5967F1" size={30} />
        )}
      </div>
      <div className="chat-input-container">
        <textarea
          className="chat-textarea"
          placeholder="Type a message..."
          rows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <PrimaryButton
          text="Send"
          onClick={handleSend}
          enabled={!loading}
        />
      </div>
    </div>
  );
};

export default Chat;
