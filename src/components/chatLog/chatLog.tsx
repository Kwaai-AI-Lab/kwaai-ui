import { conversation } from "../../data/types";
import LogGroup from "./logGroup/logGroup";
import "./chatLog.css";
import { useState, useEffect } from "react";
import messagesService from "../../services/messages.service";
import PrimaryButton from "../buttons/primaryButton/primaryButton";

interface ChatLogProps {
  botId: string;
  logItemClickConversationHandler: (item: conversation) => void;
  handleNewConversation: () => void;
  refreshTrigger: number;
  resetStateToInitial: () => void;
  currentConversationId: string | null;
}

const ChatLog: React.FC<ChatLogProps> = ({ botId, logItemClickConversationHandler, currentConversationId, refreshTrigger, resetStateToInitial, handleNewConversation }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<conversation[]>([]);
  

  const fetchConversations = async () => {
    try {
      const messagesServiceInstance = new messagesService();
      const group = await messagesServiceInstance.getConversations(botId);
      setConversations(group);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [botId, refreshTrigger]);

  const logItemClickHandler = (item: conversation) => {
    if (currentConversationId === item.id) {
      return;
    }
    setSelectedItemId(item.id);
    logItemClickConversationHandler(item);
  };
  

  const handleChangeName = (item: conversation, newName: string) => {
    try {
      const messagesServiceInstance = new messagesService();
      messagesServiceInstance.updateConversation(item, newName);
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === item.id ? { ...conv, name: newName } : conv
        )
      );
    } catch (error) {
      console.error("Error updating conversation name:", error);
    }
  };

  const handleDelete = (item: conversation) => {
    try {
      const messagesServiceInstance = new messagesService();
      messagesServiceInstance.deleteConversation(item);
      setConversations((prevConversations) =>
        prevConversations.filter((conv) => conv.id !== item.id)
      );
      if (currentConversationId === item.id) {
        setSelectedItemId(null);
        resetStateToInitial();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const groupConversationsByTimestamp = (conversations: conversation[]) => {
    const sortedConversations = [...conversations].sort(
      (a, b) => new Date(b.last_updated_timestamp).getTime() - new Date(a.last_updated_timestamp).getTime()
    );
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastSevenDays = new Date(today);
    lastSevenDays.setDate(today.getDate() - 7);
    const lastThirtyDays = new Date(today);
    lastThirtyDays.setDate(today.getDate() - 30);
  
    const todayGroup: conversation[] = [];
    const lastSevenDaysGroup: conversation[] = [];
    const lastThirtyDaysGroup: conversation[] = [];
  
    sortedConversations.forEach((conversation) => {
      const timestamp = new Date(conversation.last_updated_timestamp);
      if (timestamp >= today) {
        todayGroup.push(conversation);
      } else if (timestamp >= lastSevenDays) {
        lastSevenDaysGroup.push(conversation);
      } else if (timestamp >= lastThirtyDays) {
        lastThirtyDaysGroup.push(conversation);
      }
    });
  
    return [
      { title: "Today", conversations: todayGroup },
      { title: "Last 7 days", conversations: lastSevenDaysGroup },
      { title: "Last 30 days", conversations: lastThirtyDaysGroup },
    ];
  };
  
  const groupedConversations = groupConversationsByTimestamp(conversations);

  return (
    <div className="chatLogContainer">
      <PrimaryButton text="New conversation" enabled onClick={handleNewConversation} />
      <div className="logGroupContainer">
      {groupedConversations.map((group) => (
        <LogGroup
          key={group.title}
          group={group}
          selectedItemId={selectedItemId}
          logItemClickHandler={logItemClickHandler}
          logItemClickConversationHandler={logItemClickConversationHandler}
          onChangeName={handleChangeName}
          onDelete={handleDelete}
        />
      ))}
      </div>
    </div>
  );
};

export default ChatLog;
