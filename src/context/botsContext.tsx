import React, { createContext, useState, useContext } from "react";

interface AgentsProviderProps {
  children: React.ReactNode;
}

interface AgentsContextProps {
 agentViewType: AgentViewType;
  setAgentViewType: (viewType: AgentViewType) => void;
}

enum AgentViewType {
  MyAgents = "myAgents",
  SharedAgents = "sharedAgents",
  Personas = "personas",
}

const AgentsContext = createContext<AgentsContextProps | undefined>(undefined);

export const AgentsProvider: React.FC<AgentsProviderProps> = ({ children }) => {;
  const [agentViewType, setAgentViewType] = useState<AgentViewType>(AgentViewType.MyAgents);

  return (
    <AgentsContext.Provider value={{ agentViewType, setAgentViewType }}>
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
