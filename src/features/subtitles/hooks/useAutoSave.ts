import { useEffect, useCallback } from "react";
import { Subtitle } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useAutoSave(subtitles: Subtitle[]) {
  const { toast } = useToast();

  const saveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(
        "subtitle_editor_subtitles",
        JSON.stringify(subtitles),
      );
    } catch (error) {
      console.error("Error saving subtitles:", error);
    }
  }, [subtitles]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem("subtitle_editor_subtitles");
      if (saved) {
        return JSON.parse(saved) as Subtitle[];
      }
    } catch (error) {
      console.error("Error loading subtitles:", error);
      toast({
        title: "Error loading saved work",
        description: "Could not load your previous work",
        variant: "destructive",
      });
    }
    return null;
  }, [toast]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (subtitles.length === 0) return;

    const interval = setInterval(() => {
      saveToLocalStorage();
    }, 30000);

    return () => clearInterval(interval);
  }, [subtitles, saveToLocalStorage]);

  // Save when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (subtitles.length > 0) {
        saveToLocalStorage();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [subtitles, saveToLocalStorage]);

  return { saveToLocalStorage, loadFromLocalStorage };
}
