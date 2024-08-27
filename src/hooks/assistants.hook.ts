import { useState, useEffect } from 'react';
import AssistantsService from '../services/assistants.service';
import { Bot } from '../data/types';

const useAssistants = (kind:string) => {
  const [assistants, setAssistants] = useState<Bot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const assistantsData = await AssistantsService.getAssistants(kind);
        console.log('Fetched assistants:', assistantsData);
        setAssistants(assistantsData);
      } catch (error) {
        setError('Failed to fetch assistants');
        console.error('Error fetching assistants:', error);
      }
    };
  
    fetchAssistants();
  }, []);
  

  return { assistants, error };
};

export default useAssistants;
