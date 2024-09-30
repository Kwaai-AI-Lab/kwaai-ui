import { conversation, Message } from "../data/types";

const API_URL = process.env.REACT_APP_API_URL;

class messagesService {

    async createConversation(name:string, assistantId: string): Promise<conversation> {
        try {
          const response = await fetch(`${API_URL}/conversations/${assistantId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              assistant_id: assistantId,
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
        voice_active: string,
        options?: { signal?: AbortSignal }
      ): Promise<{ messageData: Message; audioUrl?: string }> {
        try {
          const response = await fetch(`${API_URL}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              assistant_id: assistantId,
              conversation_id: conversationId,
              prompt: prompt,
              voice_active: voice_active || "False",
            }),
            signal: options?.signal,
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
      
          const messageData = await response.json();
      
          let audioUrl: string | undefined = undefined;
      
          if (voice_active === "True") {
            const voiceResponse = await fetch(`${API_URL}/voices`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                msg_id: messageData.id,
              }),
              signal: options?.signal,
            });
      
            const contentType = voiceResponse.headers.get("Content-Type");
      
            if (contentType && contentType.includes("audio/mpeg")) {
              const audioBlob = await voiceResponse.blob();
              audioUrl = window.URL.createObjectURL(audioBlob);
            } else if (voiceResponse.ok && voiceResponse.status === 201) {
              const voiceData = await voiceResponse.json();
              audioUrl = voiceData.audio_msg_path;
            } else {
              throw new Error(`Error en la conversión de voz: ${voiceResponse.statusText}`);
            }
          }
      
          return { messageData, audioUrl };
        } catch (error: any) {
          if (error.name === "AbortError") {
            console.log("Request was aborted");
          } else {
            console.error(error);
          }
          throw error;
        }
      }      
    

    async getConversations(assistantId: string): Promise<conversation[]> {
        const filter = JSON.stringify({ assistant_id: assistantId });
        try {
          const response = await fetch(`${API_URL}/conversations?filter=${filter}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          return response.json();
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async getConversationMessages(conversationId: string): Promise<conversation> {
        try {
          const response = await fetch(`${API_URL}/conversations/${conversationId}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          return response.json();
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async updateConversation(conversation: conversation, name: string): Promise<void> {
        try {
          const response = await fetch(`${API_URL}/conversations/${conversation.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              archive: conversation.archive,
            }),
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async deleteConversation(conversation: conversation): Promise<void> {
        try {
          const response = await fetch(`${API_URL}/conversations/${conversation.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
    }

    async deleteAudioMessage(messageId: string): Promise<void> {
        try {
          const response = await fetch(`${API_URL}/voices/${messageId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
    }
}

export default messagesService;