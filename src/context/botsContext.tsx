import React, { createContext, useState, useContext, useEffect } from "react";
import { Bot, Feature, HistoryLog } from "../data/types";

interface AgentsProviderProps {
  children: React.ReactNode;
}

interface AgentsContextProps {
  myAgents: Bot[];
  shareAgents: Bot[];
  faceList: Feature[];
  voiceList: Feature[];
  historyLog: HistoryLog[];
  addToMyAgent: (bot: Bot) => void;
  updateAgent: (bot: Bot) => void; // New method for updating an agent
  removeToMyAgent: (id: string) => void;
  loadFaces: () => void;
  agentViewType: AgentViewType; // New property to store the selected view type
  setAgentViewType: (viewType: AgentViewType) => void;
}

enum AgentViewType {
  MyAgents = "myAgents",
  SharedAgents = "sharedAgents"
}

const AgentsContext = createContext<AgentsContextProps | undefined>(undefined);

export const AgentsProvider: React.FC<AgentsProviderProps> = ({ children }) => {
  const [myAgents, setMyAgents] = useState<Bot[]>([]);
  const [shareAgents, setSharedAgents] = useState<Bot[]>([]);
  const [faceList, setFaceList] = useState<Feature[]>([]);
  const [voiceList, setVoiceList] = useState<Feature[]>([]);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [agentViewType, setAgentViewType] = useState<AgentViewType>(AgentViewType.MyAgents); // Default view type

  const addToMyAgent = (agent: Bot) => {
    setMyAgents((prevMyAgents) => [...prevMyAgents, agent]);
  };

  const updateAgent = (updatedBot: Bot) => {
    setMyAgents((prevMyAgents) =>
      prevMyAgents.map((bot) => (bot.id === updatedBot.id ? updatedBot : bot))
    );
  };

  const removeToMyAgent = (id: string) => {
    setMyAgents((prevMyAgents) => prevMyAgents.filter(agent => agent.id !== id));
  };

  const loadFaces = async () => {
    try {
      const response = await fetch("/faces.json");
      const data = await response.json();
      setFaceList(data);
    } catch (error) {
      console.error("Failed to load faces", error);
    }
  };

  const loadVoices = async () => {
    try {
      const response = await fetch("/voices.json");
      const data = await response.json();
      setVoiceList(data);
    } catch (error) {
      console.error("Failed to load voices", error);
    }
  };

  const loadSharedAgents = async () => {
    try {
      const response = await fetch("/sharedAgents.json");
      const data = await response.json();
      setSharedAgents(data);
    } catch (error) {
      console.error("Failed to load shared agents", error);
    }
  };

  const loadHistoyLog = async () => {
    try {
      const response = await fetch("/historyLog.json");
      const data = await response.json();
      setHistoryLog(data);
    } catch (error) {
      console.error("Failed to load history log", error);
    }
  };

  useEffect(() => {
    loadFaces();
    loadVoices();
    loadSharedAgents();
    loadHistoyLog();
  }, []);

  return (
    <AgentsContext.Provider value={{ myAgents, shareAgents, faceList, voiceList, historyLog, addToMyAgent, updateAgent, removeToMyAgent, loadFaces, agentViewType, setAgentViewType }}>
      {children}
    </AgentsContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error("useAgents must be used within an AgentsProvider");
  }
  return context;
};

export { AgentViewType };
