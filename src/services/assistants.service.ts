import { PAIOS_API_URL } from "../config/env";
import { Bot } from "../data/types";

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
}

class AssistantsService {
  async createAssistant(
    name: string,
    description: string,
    kind: string,
    { uri, resource_llm_id, persona_id, files, status, allow_edit, icon }: 
    { 
      uri: string, 
      resource_llm_id: string, 
      persona_id: string, 
      files: string[], 
      status: string, 
      allow_edit: string, 
      icon: string 
    }
  ): Promise<CreateAssistantResponse> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          description: description,
          kind: kind,
          uri: uri,
          resource_llm_id: resource_llm_id,
          persona_id: persona_id,
          files: files,
          status: status,
          allow_edit: allow_edit,
          icon: icon
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

  async updateAssistant(assistantId: string, assistantData: Bot): Promise<CreateAssistantResponse> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/resources/${assistantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assistantData),
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

  async deleteAssistant(id: string): Promise<void> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/resources/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting assistant:", error);
      throw error;
    }
  }
}

export default AssistantsService;
