import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DotLoader } from 'react-spinners';
import AssistantsService from '../../services/assistants.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ShareHandler.css';
import AuthUtils from '../../utils/auth.helper';
import Chat from '../../components/chat/chat';
import { Bot, Persona, Message } from '../../data/types';
import AvatarAssistant from '../../components/avatarAssistant/avatarAssistant';
import PersonasService from '../../services/personas.service';
import messagesService from '../../services/messages.service';

function ShareHandler() {
    const { shareId } = useParams();
    const [loading, setLoading] = useState(true);

    const [assistantId, setAssistantId] = useState<string | null>(null);
    const [assistantInfo, setAssistantInfo] = useState<Bot | null>(null);
    const [persona, setPersona] = useState<Persona | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const personaImages: { [key: string]: string } = {
        "7bea4732-214f-40e7-9161-4e7241a2b97e": "https://static.vecteezy.com/system/resources/previews/026/536/284/non_2x/27yr-old-beautiful-face-ai-generated-free-photo.jpg",
        "7bea4732-214f-40e7-9161-4e7241a2b97f": "https://img.freepik.com/premium-photo/face-that-has-word-ai-it_872754-2069.jpg",
        "7bea4732-214f-40e7-9161-4e7241a2b97a": "https://images.nightcafe.studio//assets/man-in-suit.jpg?tr=w-1600,c-at_max",
        "7bea4732-214f-40e7-9161-4e7241a2b97b": "/DrEvelyn.png",
        "7bea4732-214f-40e7-9161-4e7241a2b97c": "/DrMarcus.png",
        "7bea4732-214f-40e7-9161-4e7241a2b97d": "/DrLinda.png",
      }; 

    const personaImageUrl = persona && personaImages[persona.face_id] ? personaImages[persona.face_id] : "/default-image.png";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const userId = AuthUtils.getUserId();

            if (shareId) {
                if (userId !== null) {
                    try {
                        await AssistantsService.updateShareAssistant(shareId, userId);
                    } catch (error) {
                        console.error("Error updating share assistant:", error);
                    }
                }

                try {
                    const shareDetails = await AssistantsService.getShareDetails(shareId);
                    console.log("Share Details:", shareDetails);
                    setAssistantId(shareDetails.resource_id);
                } catch (error) {
                    toast.error('Error loading share details');
                    setLoading(false);
                    return;
                }
            } else {
                toast.error('Share ID is not provided.');
                setLoading(false);
                return;
            }
        };

        fetchData();
    }, [shareId]);

    useEffect(() => {
        const fetchAssistantAndPersona = async () => {
            if (!assistantId) return;

            try {
                const assistantResponse = await AssistantsService.getAssistant(assistantId);
                console.log("Assistant Info:", assistantResponse);
                setAssistantInfo(assistantResponse);

                if (assistantResponse.persona_id) {
                    try {
                        const personasService = new PersonasService();
                        const fetchedPersona = await personasService.getPersona(assistantResponse.persona_id);
                        setPersona(fetchedPersona);
                    } catch (error) {
                        console.error("Error fetching persona:", error);
                    }
                }
            } catch (error) {
                toast.error('Error loading assistant details');
            } finally {
                setLoading(false);
            }
        };

        fetchAssistantAndPersona();
    }, [assistantId]);

    useEffect(() => {
        if (audioRef.current) {
          audioRef.current.volume = isMuted ? 0 : 1;
        }
      }, [isMuted]);

    const handleMessages = async (inputValue: string): Promise<string> => {
        if (isSendingMessage || !inputValue.trim()) {
          return "No message to send.";
        }

        if (!assistantId) {
            console.error("Assistant ID is null. Cannot send message.");
            toast.error("Assistant is not available.");
            return "Assistant is not available.";
        }
    
        const userMessage: Message = {
          id: Date.now().toString(),
          prompt: inputValue,
          chat_response: "",
          assistant_id: "",
          conversation_id: null,
          timestamp: "",
          is_voice_active: "",
          test: ""
        };
    
        setMessages((prevMessages) => [...prevMessages, userMessage]);
    
        setIsSendingMessage(true);
    
        try {
          const messagesServiceInstance = new messagesService();
          
    
          const { messageData, audioUrl } = await messagesServiceInstance.sendMessage(
            assistantId,
            null,
            inputValue,
            isMuted ? "False" : "True",
            { signal: abortControllerRef.current?.signal }
          );
    
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === userMessage.id ? { ...msg, chat_response: messageData.chat_response } : msg
            )
          );
    
          if (audioUrl) {
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            audio.volume = isMuted ? 0 : 1;
            await audio.play();
            await messagesServiceInstance.deleteAudioMessage(messageData.id);
          }
    
          return messageData.chat_response;
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

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };
    
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
        <div className="container">
        <ToastContainer />
        {loading ? <DotLoader color="#5967F1" size={60} /> : null}
        <h1>{assistantInfo ? assistantInfo.name : "Guest Screen"}</h1>
        <div className="sub-container">
            <div className="chat-container">  
                <Chat handleMessage={handleMessages} messages={mappedMessages} />
            </div>
            {/* <div className='right-container'>
                <AvatarAssistant personaImageUrl={personaImageUrl} toggleMuteHandler={toggleMute} isMuted={isMuted} />
            </div> */}
        </div>
        
    </div>
    );
}

export default ShareHandler;
