import React, { createContext, useState, useContext, useEffect } from "react";
import { Bot, Feature, HistoryLog, Persona, Face } from "../data/types";

interface AgentsProviderProps {
  children: React.ReactNode;
}

interface AgentsContextProps {
  myAgents: Bot[];
  shareAgents: Bot[];
  personas: Persona[];
  personaList: Feature[];
  voiceList: Feature[];
  historyLog: HistoryLog[];
  faceList: Face[];
  addToMyAgent: (bot: Bot | Persona) => void;
  updateAgent: (bot: Bot) => void;
  removeToMyAgent: (id: string) => void;
  loadPersonas: () => void;
  agentViewType: AgentViewType;
  setAgentViewType: (viewType: AgentViewType) => void;
}

enum AgentViewType {
  MyAgents = "myAgents",
  SharedAgents = "sharedAgents",
  Personas = "personas",
}

const AgentsContext = createContext<AgentsContextProps | undefined>(undefined);

export const AgentsProvider: React.FC<AgentsProviderProps> = ({ children }) => {
  const [myAgents, setMyAgents] = useState<Bot[]>([]);
  const [shareAgents, setSharedAgents] = useState<Bot[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personaList, setPersonaList] = useState<Feature[]>([]);
  const [voiceList, setVoiceList] = useState<Feature[]>([]);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [agentViewType, setAgentViewType] = useState<AgentViewType>(AgentViewType.MyAgents);

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

  const loadPersonas = async () => {
    try {
      const response = await fetch("/personas.json");
      const data = await response.json();
      setPersonaList(data);
    } catch (error) {
      console.error("Failed to load personas", error);
    }
  };

  useEffect(() => {
    loadPersonas();
  }
  , []);

  return (
    <AgentsContext.Provider value={{ myAgents, shareAgents, personas, personaList, voiceList, historyLog, addToMyAgent, updateAgent, removeToMyAgent, loadPersonas, agentViewType, setAgentViewType }}>
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
