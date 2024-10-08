import React, { useState, useEffect } from "react";
import "./chat.css";
import ChatMessage from "./chatMessage/chatMessage";  
import { DotLoader } from "react-spinners";
import sendPlane from "../../assets/send-plane.png";

interface MessageLocal {
  sender: "user" | "ai";
  text: string;
}

interface ChatProps {
  handleMessage: (inputValue: string) => Promise<string>;
  messages: MessageLocal[];
}

const Chat: React.FC<ChatProps> = ({ handleMessage, messages: incomingMessages }) => {

  const [messages, setMessages] = useState<MessageLocal[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("Thinking...");

  useEffect(() => {
    console.log('Setting Messages:', incomingMessages);
    setMessages(incomingMessages);
  }, [incomingMessages]);

  useEffect(() => {
    if (loading) {
      const texts = ["Thinking...", "Searching for references..."];
      setLoadingText(texts[0]);

      const timeout = setTimeout(() => {
        setLoadingText(texts[1]);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

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
        { sender: "ai", text: message }
      ]);
    }
    
    setLoading(false);
  };
  

  return (
    <div className="chat-container">
      <div className="chat-history">
      {messages.length === 0 && !loading && (
          <div className="chat-placeholder">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            sender={message.sender}
            text={message.text}
          />
        ))}
        {loading && (
          <div className="loading-container">
            <DotLoader color="#045CE2" size={30} />
            <p className="animate-charcter">{loadingText}</p>
          </div>
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
        <button
          onClick={handleSend}
          disabled={loading}
          className="send-button"
        >
          <img src={sendPlane} alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
