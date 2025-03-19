import { useState, useCallback } from "react";
import { Subtitle } from "../types";

export function useUndoRedo(initialState: Subtitle[] = []) {
  const [history, setHistory] = useState<Subtitle[][]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const pushState = useCallback(
    (newState: Subtitle[]) => {
      // Don't add to history if the state is the same
      if (JSON.stringify(newState) === JSON.stringify(history[currentIndex])) {
        return;
      }

      // Remove any future states if we've gone back in history
      const newHistory = history.slice(0, currentIndex + 1);

      // Add the new state and update the index
      setHistory([...newHistory, newState]);
      setCurrentIndex(newHistory.length);
    },
    [history, currentIndex],
  );

  const undo = useCallback(() => {
    if (!canUndo) return null;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canUndo, currentIndex, history]);

  const redo = useCallback(() => {
    if (!canRedo) return null;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canRedo, currentIndex, history]);

  const reset = useCallback((newState: Subtitle[] = []) => {
    setHistory([newState]);
    setCurrentIndex(0);
  }, []);

  return {
    currentState: history[currentIndex],
    pushState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  };
}
