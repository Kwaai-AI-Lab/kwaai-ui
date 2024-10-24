import { Persona } from "../data/types";
import { getAuthToken } from "../utils/auth.helper";

const API_URL = process.env.REACT_APP_API_URL;

class PersonasService {
  static async getPersonas(): Promise<Persona[]> {
    console.log("getPersonas()");
    try {
      const response = await fetch(`${API_URL}/personas`, {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);  // Log detailed error for debugging
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching personas:", error);
      return [];
    }
  }

  async getPersona(id: string): Promise<Persona> {
    try {
      const response = await fetch(`${API_URL}/personas/${id}`, {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);  // Log detailed error for debugging
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching persona:", error);
      throw error;
    }
  }


  async createPersona(persona: Persona): Promise<Persona> {
    try {
      const response = await fetch(`${API_URL}/personas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(persona),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating persona:", error);
      throw error;
    }
  }

  async updatePersona(id: string, persona: Persona): Promise<Persona> {
    try {
      const response = await fetch(`${API_URL}/personas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(persona),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating persona:", error);
      throw error;
    }
  }

  static async deletePersona(id: string | undefined): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/personas/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || response.statusText;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting persona:", error);
      throw error;
    }
  }

  async getVoices(): Promise<string[]> {
    try {
      const response = await fetch(`${API_URL}/voices`,{
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching voices:", error);
      return [];
    }
  }
}

export default PersonasService;
