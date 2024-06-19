import React, { useState } from "react";
import "./chat.css";  // Import the CSS file
import ChatMessage from "./chatMessage/chatMessage";  
import PrimaryButton from "../buttons/primaryButton/primaryButton"; 

interface Message {
  sender: "user" | "ai";
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { sender: "user", text: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");

    setLoading(true);
    setTimeout(() => {
      const aiMessage: Message = { sender: "ai", text: "This is the AI response." };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setLoading(false);
    }, 1000); // Simulate loading time
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
          <ChatMessage sender="ai" text="Loading..." />
        )}
      </div>
      <div className="chat-input-container">
        <textarea
          className="chat-textarea"
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
