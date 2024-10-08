import React, { useEffect, useState, useCallback } from "react";
import { Bot, conversation, Message, Persona } from "../../data/types";
import backIcon from "../../assets/back-button-icon.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import Chat from "../../components/chat/chat";
import ChatLog from "../../components/chatLog/chatLog";
import messagesService from "../../services/messages.service";
import "./agentInteraction.css";
import PersonasService from "../../services/personas.service";

interface AgentInteractionProps {
  bot: Bot;
  onBack: () => void;
}

const personaImages: { [key: string]: string } = {
  "7bea4732-214f-40e7-9161-4e7241a2b97e": "https://static.vecteezy.com/system/resources/previews/026/536/284/non_2x/27yr-old-beautiful-face-ai-generated-free-photo.jpg",
  "7bea4732-214f-40e7-9161-4e7241a2b97f": "https://img.freepik.com/premium-photo/face-that-has-word-ai-it_872754-2069.jpg",
  "7bea4732-214f-40e7-9161-4e7241a2b97a": "https://images.nightcafe.studio//assets/man-in-suit.jpg?tr=w-1600,c-at_max",
  "7bea4732-214f-40e7-9161-4e7241a2b97b": "/DrEvelyn.png",
  "7bea4732-214f-40e7-9161-4e7241a2b97c": "/DrMarcus.png",
  "7bea4732-214f-40e7-9161-4e7241a2b97d": "/DrLinda.png",
};

const AgentInteraction: React.FC<AgentInteractionProps> = ({ bot, onBack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const personasService = new PersonasService();
        const fetchedPersona = await personasService.getPersona(bot.persona_id);
        setPersona(fetchedPersona);
      } catch (error) {
        console.error("Error fetching persona:", error);
      }
    };

    fetchPersonas();
  }, [bot.persona_id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        try {
          const messagesServiceInstance = new messagesService();
          const response = await messagesServiceInstance.getConversationMessages(conversationId);
          setMessages(Array.isArray(response.messages) ? response.messages : []);
        } catch (error) {
          console.error("Error fetching messages:", error);
          setMessages([]);
        }
      }
    };

    fetchMessages();
  }, [conversationId]);

  const resetStateToInitial = () => {
    setConversationId(null);
    setMessages([]);
  };

  const fetchConversations = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const logItemClickConversationHandler = (item: conversation) => {
    setConversationId(item.id);
  };

  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([]);
  };

  const handleMessages = async (inputValue: string): Promise<string> => {
    if (isSendingMessage || !inputValue.trim()) {
      return "No message to send.";
    }
  
    setIsSendingMessage(true);
  
    try {
      const messagesServiceInstance = new messagesService();
      let currentConversationId = conversationId;
  
      if (!currentConversationId) {
        const conversation = await messagesServiceInstance.createConversation(inputValue, bot.id);
        currentConversationId = conversation.id;
        setConversationId(currentConversationId);
  
        await fetchConversations();
      }
  
      const message = await messagesServiceInstance.sendMessage(bot.id, currentConversationId, inputValue);
  
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((msg) => msg.id === message.id);
        if (!messageExists) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
  
      return message.chat_response;
    } catch (error) {
      console.error("Error sending message:", error);
      return "There was an error sending your message.";
    } finally {
      setIsSendingMessage(false);
    }
  };  
  
  

  const personaImageUrl = persona && personaImages[persona.face_id] ? personaImages[persona.face_id] : "/default-image.png";

  const mappedMessages = Array.isArray(messages)
    ? messages.flatMap((message) => [
        {
          sender: "user" as const,
          text: message.prompt,
        },
        {
          sender: "ai" as const,
          text: message.chat_response,
        },
      ])
    : [];

  return (
    <div className="agentInteractionContainer">
      <div className="headerInteractionContainer">
        <button onClick={onBack} className="backButton">
          <img src={backIcon} alt="Back" className="backIcon" />
        </button>
        <h1 className="botName">{bot.name}</h1>
        <p className="additionalText">CS-346</p>
      </div>
      <div className="bodyInteractionContainer">
        <div className="leftContent">
          <Chat handleMessage={handleMessages} messages={mappedMessages} />
        </div>
        <div className="rightContent">
          <div className="imageContainer">
            <img src={personaImageUrl} alt="Bot" className="botImage" />
            <button onClick={toggleMute} className="muteButton">
              <FontAwesomeIcon icon={isMuted ? faVolumeUp : faVolumeMute} className="muteIcon" />
            </button>
          </div>
          <div className="historyContent">
          <ChatLog 
            botId={bot.id} 
            logItemClickConversationHandler={logItemClickConversationHandler} 
            handleNewConversation={handleNewConversation} 
            refreshTrigger={refreshTrigger} 
            resetStateToInitial={resetStateToInitial} 
            currentConversationId={conversationId}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentInteraction;
