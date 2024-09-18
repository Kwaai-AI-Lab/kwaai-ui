import { useState, useEffect, useCallback } from 'react';
import PersonasService from '../services/personas.service';
import { Persona } from '../data/types';

interface UsePersonasResult {
  personas: Persona[];
  loading: boolean;
  error: string | null;
  refetchPersonas: () => void;
}

const usePersonas = (): UsePersonasResult => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonas = useCallback(async () => {
    setLoading(true);
    try {
      const personasData = await PersonasService.getPersonas();
      setPersonas(personasData);
    } catch (error) {
      setError('Failed to fetch personas');
      console.error('Error fetching personas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  return { personas, loading, error, refetchPersonas: fetchPersonas };
};

export default usePersonas;
