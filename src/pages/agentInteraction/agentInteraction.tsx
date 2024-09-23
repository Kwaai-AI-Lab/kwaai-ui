import React, { useEffect, useState, useCallback, useRef } from "react";
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

  const abortControllerRef = useRef<AbortController | null>(null);

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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const fetchConversations = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const updateConversationOrder = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const logItemClickConversationHandler = (item: conversation) => {
    if (conversationId === item.id) {
      return;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setConversationId(item.id);
    setMessages([]);
  };
  

  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleMessages = async (inputValue: string): Promise<string> => {
    if (isSendingMessage || !inputValue.trim()) {
      return "No message to send.";
    }
  
    const userMessage: Message = {
      id: Date.now().toString(),
      prompt: inputValue,
      chat_response: "",
    };
  
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    setIsSendingMessage(true);
  
    try {
      const messagesServiceInstance = new messagesService();
      let currentConversationId = conversationId;
  
      if (!currentConversationId) {
        const conversation = await messagesServiceInstance.createConversation(inputValue, bot.id);
        currentConversationId = conversation.id;
        setConversationId(currentConversationId);
  
        setMessages((prevMessages) => [...prevMessages]);
      }
  
      const message = await messagesServiceInstance.sendMessage(
        bot.id,
        currentConversationId,
        inputValue,
        { signal: abortControllerRef.current?.signal }
      );
  
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === userMessage.id ? { ...msg, chat_response: message.chat_response } : msg
        )
      );
  
      fetchConversations();
      if (conversationId !== currentConversationId) {
        updateConversationOrder();
      }
  
      return message.chat_response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error("Error sending message:", error);
        return "There was an error sending your message.";
      }
    } finally {
      setIsSendingMessage(false);
    }
  
    return "";
  };
  
  
  

  const personaImageUrl = persona && personaImages[persona.face_id] ? personaImages[persona.face_id] : "/default-image.png";

  const mappedMessages = Array.isArray(messages)
  ? messages.flatMap((message) => {
      const mappedUserMessage = {
        sender: "user" as const,
        text: message.prompt,
      };
      
      const mappedBotMessage = message.chat_response
        ? {
            sender: "ai" as const,
            text: message.chat_response,
          }
        : null;

      return mappedBotMessage ? [mappedUserMessage, mappedBotMessage] : [mappedUserMessage];
    })
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
