import { useEffect } from "react";
import { Subtitle } from "../types";

interface KeyboardShortcutsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  subtitles: Subtitle[];
  currentSubtitleId: number | null;
  onAddSubtitle: (afterId: number) => void;
  onSplitSubtitle: (id: number) => void;
  onMergeSubtitle: (id: number) => void;
  onDeleteSubtitle: (id: number) => void;
  onDownloadSRT: () => void;
  isPro: boolean;
}

export function useKeyboardShortcuts({
  videoRef,
  subtitles,
  currentSubtitleId,
  onAddSubtitle,
  onSplitSubtitle,
  onMergeSubtitle,
  onDeleteSubtitle,
  onDownloadSRT,
  isPro,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Space to play/pause video
      if (e.code === "Space") {
        e.preventDefault();
        const video = videoRef.current;
        if (video) {
          video.paused ? video.play() : video.pause();
        }
      }

      // Ctrl/Cmd + S to save/download
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
        e.preventDefault();
        onDownloadSRT();
      }

      // Handle subtitle editing shortcuts when a subtitle is selected
      if (currentSubtitleId !== null) {
        // Ctrl/Cmd + Enter to add new subtitle
        if ((e.ctrlKey || e.metaKey) && e.code === "Enter") {
          e.preventDefault();
          onAddSubtitle(currentSubtitleId);
        }

        // Ctrl/Cmd + Delete to delete subtitle
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.code === "Delete" || e.code === "Backspace")
        ) {
          e.preventDefault();
          onDeleteSubtitle(currentSubtitleId);
        }

        // Pro features
        if (isPro) {
          // Ctrl/Cmd + D to split subtitle
          if ((e.ctrlKey || e.metaKey) && e.code === "KeyD") {
            e.preventDefault();
            onSplitSubtitle(currentSubtitleId);
          }

          // Ctrl/Cmd + M to merge subtitle
          if ((e.ctrlKey || e.metaKey) && e.code === "KeyM") {
            e.preventDefault();
            onMergeSubtitle(currentSubtitleId);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    videoRef,
    currentSubtitleId,
    subtitles,
    onAddSubtitle,
    onSplitSubtitle,
    onMergeSubtitle,
    onDeleteSubtitle,
    onDownloadSRT,
    isPro,
  ]);
}
