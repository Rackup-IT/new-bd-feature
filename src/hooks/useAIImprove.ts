import { useState } from 'react';

interface UseAIImproveReturn {
  improveText: (text: string) => Promise<string>;
  isImproving: boolean;
  error: string | null;
}

export function useAIImprove(): UseAIImproveReturn {
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improveText = async (text: string): Promise<string> => {
    if (!text?.trim()) {
      throw new Error('No text provided');
    }

    setIsImproving(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/ai-improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve text');
      }

      const data = await response.json();
      return data.improvedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to improve text';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsImproving(false);
    }
  };

  return {
    improveText,
    isImproving,
    error,
  };
}
