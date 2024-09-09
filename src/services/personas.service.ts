import { PAIOS_API_URL } from "../config/env";
import { Persona } from "../data/types";

class PersonasService {
  static async getPersonas(): Promise<Persona[]> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/personas`);
      if (!response.ok) {
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
      const response = await fetch(`${PAIOS_API_URL}/personas/${id}`);
      if (!response.ok) {
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
      const response = await fetch(`${PAIOS_API_URL}/personas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      const response = await fetch(`${PAIOS_API_URL}/personas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

  async deletePersona(id: string): Promise<void> {
    try {
      const response = await fetch(`${PAIOS_API_URL}/personas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting persona:", error);
      throw error;
    }
  }
}

export default PersonasService;
