import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { parseSRT, formatSRT } from "../utils";
import { timeToMs, msToTime, calculateMidTime, incrementTime } from "../utils";
import { type Subtitle } from "../types";
import { useAutoSave } from "./useAutoSave";
import { useSubtitleHistory } from "./useSubtitleHistory";
import { saveSubtitles, getProjectSubtitles } from "@/services/projectService";

export function useSubtitles(isPro: boolean, projectId?: number | null) {
  const { toast } = useToast();
  const [currentSubtitleId, setCurrentSubtitleId] = useState<number | null>(
    null,
  );
  const [wordsPerSubtitle, setWordsPerSubtitle] = useState<number>(1);

  // Use history management for subtitles
  const {
    subtitles,
    setSubtitles,
    performAction,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useSubtitleHistory([]);

  const { saveToLocalStorage, loadFromLocalStorage } = useAutoSave(subtitles);

  const handleImportSRT = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        if (content) {
          try {
            const parsedSubtitles = parseSRT(content);

            // Reset history with new subtitles
            resetHistory(parsedSubtitles);

            // Auto-save to database if project ID is available
            if (projectId) {
              try {
                // Format subtitles for database saving
                const dbSubtitles = parsedSubtitles.map((subtitle) => {
                  // Convert HH:MM:SS,mmm format to milliseconds
                  const startTimeMs = timeToMs(subtitle.startTime);
                  const endTimeMs = timeToMs(subtitle.endTime);

                  return {
                    start_time: Math.floor(startTimeMs / 1000), // Convert to integer seconds for DB
                    end_time: Math.floor(endTimeMs / 1000), // Convert to integer seconds for DB
                    text: subtitle.text,
                  };
                });

                await saveSubtitles(Number(projectId), dbSubtitles);

                toast({
                  title: "SRT file imported and saved",
                  description: `Loaded and saved ${parsedSubtitles.length} subtitles to project #${projectId}`,
                });
              } catch (saveError) {
                toast({
                  title: "SRT file imported",
                  description: `Loaded ${parsedSubtitles.length} subtitles, but couldn't save to database. Changes will be saved when you click Save Project.`,
                  variant: "destructive",
                });
              }
            } else {
              toast({
                title: "SRT file imported successfully",
                description: `Loaded ${parsedSubtitles.length} subtitles`,
              });
            }
          } catch (error) {
            toast({
              title: "Import failed",
              description:
                "Invalid SRT file format. Please check the file and try again.",
              variant: "destructive",
            });
          }
        }
      };
      reader.readAsText(file);

      // Clear the file input value to allow re-importing the same file
      event.target.value = "";
    },
    [toast, resetHistory, projectId],
  );

  const updateSubtitle = useCallback(
    (id: number, field: keyof Subtitle, value: string) => {
      performAction((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub)),
      );
    },
    [performAction],
  );

  const deleteSubtitle = useCallback(
    (id: number) => {
      performAction((prev) => prev.filter((sub) => sub.id !== id));
      toast({
        title: "Subtitle deleted",
        description: "The subtitle has been removed",
      });
    },
    [toast, performAction],
  );

  const downloadSRT = useCallback(() => {
    const content = formatSRT(subtitles);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.srt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "SRT file downloaded",
      description: "Your subtitles have been exported successfully",
    });
  }, [subtitles, toast]);

  const addNewSubtitle = useCallback(
    (afterId: number) => {
      if (!isPro && subtitles.length >= 10) {
        toast({
          title: "Free plan limit reached",
          description: "Upgrade to Pro to add unlimited subtitles",
          variant: "destructive",
        });
        return;
      }

      performAction((prev) => {
        const currentSubtitle = prev.find((s) => s.id === afterId);
        const newId = Math.max(...prev.map((s) => s.id), 0) + 1;
        const index = currentSubtitle
          ? prev.findIndex((s) => s.id === afterId) + 1
          : prev.length;

        const newSubtitle: Subtitle = {
          id: newId,
          startTime: currentSubtitle ? currentSubtitle.endTime : "00:00:00,000",
          endTime: currentSubtitle
            ? incrementTime(currentSubtitle.endTime, 2)
            : "00:00:02,000",
          text: "",
        };

        return [...prev.slice(0, index), newSubtitle, ...prev.slice(index)];
      });
    },
    [isPro, subtitles.length, toast, performAction],
  );

  const mergeSubtitles = useCallback(
    (id: number) => {
      if (!isPro) {
        toast({
          title: "Pro feature",
          description: "Upgrade to Pro to use advanced editing features",
          variant: "destructive",
        });
        return;
      }

      const currentSubtitle = subtitles.find((s) => s.id === id);
      if (!currentSubtitle) return;

      const index = subtitles.findIndex((s) => s.id === id);
      const prevSubtitle = index > 0 ? subtitles[index - 1] : null;
      const nextSubtitle =
        index < subtitles.length - 1 ? subtitles[index + 1] : null;

      const prevTimeDiff = prevSubtitle
        ? Math.abs(
            timeToMs(currentSubtitle.startTime) -
              timeToMs(prevSubtitle.endTime),
          )
        : Infinity;
      const nextTimeDiff = nextSubtitle
        ? Math.abs(
            timeToMs(nextSubtitle.startTime) -
              timeToMs(currentSubtitle.endTime),
          )
        : Infinity;

      if (prevTimeDiff < nextTimeDiff && prevSubtitle) {
        const mergedSubtitle: Subtitle = {
          id: prevSubtitle.id,
          startTime: prevSubtitle.startTime,
          endTime: currentSubtitle.endTime,
          text: `${prevSubtitle.text}\n${currentSubtitle.text}`,
        };
        performAction((prev) => [
          ...prev.slice(0, index - 1),
          mergedSubtitle,
          ...prev.slice(index + 1),
        ]);
        toast({
          title: "Subtitles merged",
          description: "The selected subtitles have been combined",
        });
      } else if (nextSubtitle) {
        const mergedSubtitle: Subtitle = {
          id: currentSubtitle.id,
          startTime: currentSubtitle.startTime,
          endTime: nextSubtitle.endTime,
          text: `${currentSubtitle.text}\n${nextSubtitle.text}`,
        };
        performAction((prev) => [
          ...prev.slice(0, index),
          mergedSubtitle,
          ...prev.slice(index + 2),
        ]);
        toast({
          title: "Subtitles merged",
          description: "The selected subtitles have been combined",
        });
      }
    },
    [isPro, subtitles, toast, performAction],
  );

  const splitSubtitle = useCallback(
    (id: number) => {
      if (!isPro) {
        toast({
          title: "Pro feature",
          description: "Upgrade to Pro to use advanced editing features",
          variant: "destructive",
        });
        return;
      }

      const subtitle = subtitles.find((s) => s.id === id);
      if (!subtitle) return;

      const midTime = calculateMidTime(subtitle.startTime, subtitle.endTime);
      const newId = Math.max(...subtitles.map((s) => s.id)) + 1;

      const textParts = subtitle.text.split(" ");
      const midIndex = Math.floor(textParts.length / 2);
      const firstText = textParts.slice(0, midIndex).join(" ");
      const secondText = textParts.slice(midIndex).join(" ");

      const firstHalf: Subtitle = {
        ...subtitle,
        endTime: midTime,
        text: firstText,
      };

      const secondHalf: Subtitle = {
        id: newId,
        startTime: midTime,
        endTime: subtitle.endTime,
        text: secondText,
      };

      const index = subtitles.findIndex((s) => s.id === id);

      performAction((prev) => [
        ...prev.slice(0, index),
        firstHalf,
        secondHalf,
        ...prev.slice(index + 1),
      ]);

      toast({
        title: "Subtitle split",
        description: "The subtitle has been split into two parts",
      });
    },
    [isPro, subtitles, toast, performAction],
  );

  const handleTimeUpdate = useCallback(
    (time: number) => {
      const activeSubId =
        subtitles.find((sub) => {
          const startMs = timeToMs(sub.startTime) / 1000;
          const endMs = timeToMs(sub.endTime) / 1000;
          return time >= startMs && time <= endMs;
        })?.id || null;
      setCurrentSubtitleId(activeSubId);
    },
    [subtitles],
  );

  const handleReset = useCallback(() => {
    resetHistory([]);
    localStorage.removeItem("subtitle_editor_subtitles");
    toast({
      title: "Project reset",
      description: "All subtitles have been cleared",
    });
  }, [toast, resetHistory]);

  const handleSplitAllSubtitles = useCallback(() => {
    if (!isPro) {
      toast({
        title: "Pro feature",
        description: "Upgrade to Pro to use advanced editing features",
        variant: "destructive",
      });
      return;
    }

    if (wordsPerSubtitle <= 0) {
      toast({
        title: "Invalid setting",
        description: "Words per subtitle must be greater than zero",
        variant: "destructive",
      });
      return;
    }

    performAction((prev) => {
      if (prev.length === 0) {
        toast({
          title: "No subtitles to split",
          description: "Add some subtitles first",
          variant: "destructive",
        });
        return prev;
      }

      const newSubtitles: Subtitle[] = [];
      let nextId = Math.max(...prev.map((s) => s.id), 0) + 1;

      prev.forEach((subtitle) => {
        const words = subtitle.text.trim().split(/\s+/);

        if (words.length <= wordsPerSubtitle || words.length <= 1) {
          // If subtitle has fewer words than the target or just one word, keep it as is
          newSubtitles.push(subtitle);
          return;
        }

        // Calculate time per word for even distribution
        const startTimeMs = timeToMs(subtitle.startTime);
        const endTimeMs = timeToMs(subtitle.endTime);
        const duration = endTimeMs - startTimeMs;

        // Split words into chunks of the specified size
        const chunks: string[] = [];
        for (let i = 0; i < words.length; i += wordsPerSubtitle) {
          chunks.push(
            words
              .slice(i, Math.min(i + wordsPerSubtitle, words.length))
              .join(" "),
          );
        }

        const timePerChunk = duration / chunks.length;

        // Create new subtitle for each chunk
        chunks.forEach((chunk, index) => {
          const chunkStartTime = startTimeMs + timePerChunk * index;
          const chunkEndTime = chunkStartTime + timePerChunk;

          newSubtitles.push({
            id: index === 0 ? subtitle.id : nextId++,
            text: chunk,
            startTime: msToTime(chunkStartTime),
            endTime: msToTime(chunkEndTime),
          });
        });
      });

      toast({
        title: "Subtitles split successfully",
        description: `Split into ${wordsPerSubtitle} ${wordsPerSubtitle === 1 ? "word" : "words"} per subtitle`,
      });

      return newSubtitles;
    });
  }, [isPro, wordsPerSubtitle, toast, performAction]);

  // Add a function to explicitly load from localStorage
  const loadFromLocalStorageManually = useCallback(() => {
    const savedSubtitles = loadFromLocalStorage();
    if (savedSubtitles && savedSubtitles.length > 0) {
      resetHistory(savedSubtitles);
      toast({
        title: "Work restored",
        description: `Loaded ${savedSubtitles.length} saved subtitles`,
      });
      return true;
    }
    return false;
  }, [loadFromLocalStorage, toast, resetHistory]);

  // Save subtitles when they change
  useEffect(() => {
    if (subtitles.length > 0) {
      saveToLocalStorage();
    }
  }, [subtitles, saveToLocalStorage]);

  // Add this effect to clear subtitles when project ID changes
  useEffect(() => {
    // Clear subtitles when project ID changes
    if (projectId) {
      console.log(`Project ID changed to ${projectId}, clearing subtitles`);
      resetHistory([]);
    }
  }, [projectId, resetHistory]);

  const loadSubtitlesFromDB = useCallback(
    async (projectId: number) => {
      if (!projectId) return false;

      try {
        // Clear any existing subtitles first
        resetHistory([]);

        const subtitlesData = await getProjectSubtitles(projectId);

        if (subtitlesData && subtitlesData.length > 0) {
          // Format the subtitles from the database format to the app format
          const formattedSubtitles = subtitlesData.map((sub) => {
            // Convert seconds to milliseconds, then to time string
            const startTime = msToTime(sub.start_time * 1000);
            const endTime = msToTime(sub.end_time * 1000);

            return {
              id: sub.id || Math.floor(Math.random() * 10000), // Ensure we have an ID
              startTime: startTime,
              endTime: endTime,
              text: sub.text || "",
            };
          });

          // Reset history with loaded subtitles
          resetHistory(formattedSubtitles);

          toast({
            title: "Subtitles loaded",
            description: `Loaded ${formattedSubtitles.length} subtitles from project #${projectId}`,
          });
          return true;
        } else {
          // Clear any existing subtitles when none are found for this project
          resetHistory([]);
          return false;
        }
      } catch (error) {
        toast({
          title: "Error loading subtitles",
          description:
            "Could not load your saved subtitles. Try refreshing the page.",
          variant: "destructive",
        });
        return false;
      }
    },
    [resetHistory, toast],
  );

  return {
    subtitles,
    currentSubtitleId,
    wordsPerSubtitle,
    setSubtitles,
    resetHistory,

    handleImportSRT,
    updateSubtitle,
    deleteSubtitle,
    downloadSRT,
    addNewSubtitle,
    mergeSubtitles,
    splitSubtitle,
    handleTimeUpdate,
    handleReset,
    handleSplitAllSubtitles,
    setWordsPerSubtitle,
    undo,
    redo,
    canUndo,
    canRedo,
    loadFromLocalStorageManually,
    loadSubtitlesFromDB,
  };
}
