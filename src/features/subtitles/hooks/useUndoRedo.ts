// This file is deprecated. Use useSubtitleHistory.ts instead which provides the same functionality.
// File kept for backward compatibility but should be removed in future refactoring.

import { useSubtitleHistory } from "./useSubtitleHistory";
import { Subtitle } from "../types";

export function useUndoRedo(initialState: Subtitle[] = []) {
  const {
    subtitles: currentState,
    setSubtitles: pushState,
    undo,
    redo,
    resetHistory: reset,
    canUndo,
    canRedo,
  } = useSubtitleHistory(initialState);

  return {
    currentState,
    pushState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  };
}
