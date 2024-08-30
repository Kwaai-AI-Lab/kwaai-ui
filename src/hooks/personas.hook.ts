import { useState, useEffect } from 'react';
import PersonasService from '../services/personas.service';
import { Persona } from '../data/types';

const usePersonas = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const personasData = await PersonasService.getPersonas();
        setPersonas(personasData);
      } catch (error) {
        setError('Failed to fetch personas');
        console.error('Error fetching personas:', error);
      }
    };
  
    fetchAssistants();
  }, []);
  

  return { personas, error };
};

export default usePersonas;
