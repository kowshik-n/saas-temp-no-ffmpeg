import { useState, useCallback } from "react";
import { type Subtitle } from "../types";

type HistoryState = {
  past: Subtitle[][];
  present: Subtitle[];
  future: Subtitle[][];
};

export function useSubtitleHistory(initialSubtitles: Subtitle[] = []) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialSubtitles,
    future: [],
  });

  // Update present state without recording in history
  const setPresent = useCallback((newPresent: Subtitle[]) => {
    setHistory((prev) => ({
      ...prev,
      present: newPresent,
    }));
  }, []);

  // Record current state in history and perform action
  const performAction = useCallback(
    (action: (subtitles: Subtitle[]) => Subtitle[]) => {
      setHistory(({ past, present, future }) => {
        const newPresent = action(present);
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
      });
    },
    [],
  );

  // Undo last action
  const undo = useCallback(() => {
    setHistory(({ past, present, future }) => {
      if (past.length === 0) return { past, present, future };

      const newPast = past.slice(0, past.length - 1);
      const newPresent = past[past.length - 1];

      return {
        past: newPast,
        present: newPresent,
        future: [present, ...future],
      };
    });
  }, []);

  // Redo last undone action
  const redo = useCallback(() => {
    setHistory(({ past, present, future }) => {
      if (future.length === 0) return { past, present, future };

      const newFuture = future.slice(1);
      const newPresent = future[0];

      return {
        past: [...past, present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  // Reset history with new initial state
  const resetHistory = useCallback((newInitialState: Subtitle[] = []) => {
    setHistory({
      past: [],
      present: newInitialState,
      future: [],
    });
  }, []);

  return {
    subtitles: history.present,
    setSubtitles: setPresent,
    performAction,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    resetHistory,
  };
}
