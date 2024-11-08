import { Bot, conversation, Message, AssistantFile } from "../data/types";
import { getAuthToken } from "../utils/auth.helper";

interface CreateAssistantResponse {
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
  id: string;
  active: string;
  user_id: string;
}

const API_URL = process.env.REACT_APP_API_URL;

class AssistantsService {
  async createAssistant(
    name: string,
    description: string,
    kind: string,
    {
      uri,
      resource_llm_id,
      persona_id,
      files,
      status,
      allow_edit,
      icon,
      active,
      user_id,
    }: {
      uri: string;
      resource_llm_id: string;
      persona_id: string;
      files: string[];
      status: string;
      allow_edit: string;
      icon: string;
      active: string;
      user_id: string;
    }
  ): Promise<CreateAssistantResponse> {
    try {
      const response = await fetch(`${API_URL}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          name,
          description,
          kind,
          uri,
          resource_llm_id,
          persona_id,
          files,
          status,
          allow_edit,
          icon,
          active,
          user_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating assistant:", error);
      throw error;
    }
  }

  static async getSharedAssistants( userId: string ): Promise<Bot[]> {
    try {
      const response = await fetch(`${API_URL}/resources/${userId}/shared`, {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response format");
      }
      return data;
    } catch (error) {
      console.error("Error fetching assistants:", error);
      throw new Error(`Error fetching assistants: ${error}`);
    }
  }

  static async shareAssistant(
    assistantId: string,
    expirationDate: string
  ): Promise<{ id: string }> {
    try {
      const response = await fetch(`${API_URL}/shares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          resource_id: assistantId,
          expiration_dt: expirationDate,
          is_revoked: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error sharing assistant:", error);
      throw error;
    }
  }

  static async updateShareAssistant(
    id: string | undefined,
    user_id: string | null,
    expirationDate?: string
  ): Promise<void> {
    try {
      const body: any = { user_id };
      if (expirationDate) {
        body.expiration_dt = expirationDate;
      }

      const response = await fetch(`${API_URL}/shares/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating share assistant:", error);
      throw error;
    }
  }

  async updateAssistant(
    assistantId: string,
    assistantData: Bot & { active: string; user_id: string }
  ): Promise<CreateAssistantResponse> {
    const { id, ...payload } = assistantData;
    try {
      const response = await fetch(`${API_URL}/resources/${assistantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  static async deleteAssistant(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting assistant:", error);
      throw error;
    }
  }

  async uploadFiles(assistantId: string, files: File[]): Promise<void> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        console.log(file.name);
        formData.append("files", file);
      });

      const response = await fetch(`${API_URL}/rag-indexing/${assistantId}/`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  static async getAssistants(kind: string): Promise<Bot[]> {
    try {
      const response = await fetch(
        `${API_URL}/resources?filter={"kind":"${kind}"}`,{
          headers: {
            "Authorization": `Bearer ${getAuthToken()}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response format");
      }
      return data;
    } catch (error) {
      console.error("Error fetching assistants:", error);
      throw new Error(`Error fetching assistants: ${error}`);
    }
  }

  async createConversation(
    name: string,
    assistantId: string
  ): Promise<conversation> {
    try {
      const response = await fetch(`${API_URL}/conversations/${assistantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          name: name,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async sendMessage(
    assistantId: string,
    conversationId: string | null,
    prompt: string,
    test: string
  ): Promise<Message> {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          assistant_id: assistantId,
          conversation_id: conversationId,
          prompt: prompt,
          test: test || "",
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getFiles(assistantId: string): Promise<AssistantFile[]> {
    try {
      const response = await fetch(`${API_URL}/rag-indexing/${assistantId}/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response format");
      }
      const files = data as AssistantFile[];
      console.log("Files = ", files);
      return files;
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  }

  async deleteFiles(assistantId: string, fileIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/rag-indexing/${assistantId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          file_ids: fileIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("Files deleted successfully");
    } catch (error) {
      console.error("Error deleting files:", error);
      throw error;
    }
  }

  async getAnswer(assistantId: string, question: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          assistant_id: assistantId,
          prompt: question,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      console.log("response = ", data.chat_response);
      return data.chat_response;
    } catch (error) {
      console.error("Error fetching answer:", error);
      throw error;
    }
  }
}

export default AssistantsService;
