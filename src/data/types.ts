export interface LlmOption {
  id: string;
  name: string;
  image: string;
}

export interface Bot {
  id: string;
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

export interface Persona {
  id?: string;
  name: string;
  description: string;
  voice_id: string;
  face_id: string;
}

export interface conversation {
  id: string;
  name: string;
  created_timestamp: string;
  last_updated_timestamp: string;
  messages: Message[];
  archive: string;
  assistant_id: string;
}

export interface Face {
  id: string;
  name: string;
  imageURL: string;
}

export interface Message {
  id: string;
  assistant_id: string;
  conversation_id: string | null;
  timestamp: string;
  prompt: string;
  chat_response: string;
  test: string;
}

export interface ConversationGroup {
  conversations: conversation[];
  title: string;
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

export interface Voices {
  id: string;
  name: string;
  imageURL: string;
  videoURL: string;
  sampleURL: string;
}

export interface HistoryLog {
  title: string;
  logs: conversation[];
}

export interface AssistantFile {
  name: string;
  num_chunks: string | null;
  id: string | null;
  file_id: string | null;
}
