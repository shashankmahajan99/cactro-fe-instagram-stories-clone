import type { User } from '@/data/stories';
import { useCallback, useState } from 'react';

export const useStoryNavigation = (user: User | null) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const canGoNext = useCallback(() => {
    return user ? currentStoryIndex < user.stories.length - 1 : false;
  }, [user, currentStoryIndex]);

  const canGoPrevious = useCallback(() => {
    return currentStoryIndex > 0;
  }, [currentStoryIndex]);

  const goNext = useCallback(() => {
    if (canGoNext()) {
      setCurrentStoryIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [canGoNext]);

  const goPrevious = useCallback(() => {
    if (canGoPrevious()) {
      setCurrentStoryIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [canGoPrevious]);

  const reset = useCallback(() => {
    setCurrentStoryIndex(0);
  }, []);

  const getCurrentStory = useCallback(() => {
    return user?.stories[currentStoryIndex] || null;
  }, [user, currentStoryIndex]);

  return {
    currentStoryIndex,
    canGoNext,
    canGoPrevious,
    goNext,
    goPrevious,
    reset,
    getCurrentStory,
  };
};
