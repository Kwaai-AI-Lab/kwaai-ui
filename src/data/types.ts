export interface LlmOption {
  id: string;
  name: string;
  image: string;
}

export interface Bot {
  id?: string;
  name: string;
  uri: string;
  description: string;
  resource_llm_id: string;
  persona_id: string;
  files: string[];
  status: string;
  allow_edit: string;
  kind: string;
  icon: string;
}



export interface File {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface Feature {
  description: string;
  id: string;
  name: string;
  imageURL: string;
  videoURL: string;
}

export interface HistoryLog {
  title: string;
  logs: HistoryItem[];
}

export interface HistoryItem {
  id: string;
  content: string;
}
