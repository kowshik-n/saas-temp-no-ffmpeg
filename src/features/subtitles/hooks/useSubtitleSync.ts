import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { saveSubtitles, getProjectSubtitles } from "@/services/projectService";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { type Subtitle } from "../types";

export function useSubtitleSync(projectId: number | null, isPro: boolean) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(isPro);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  // Function to save subtitles to the server
  const syncSubtitles = useCallback(
    async (subtitles: Subtitle[], showToast = true) => {
      if (!projectId) return false;

      setIsSyncing(true);
      try {
        // Format subtitles for saving
        const formattedSubtitles = subtitles.map((sub) => ({
          start_time: timeToMs(sub.startTime),
          end_time: timeToMs(sub.endTime),
          text: sub.text,
        }));

        await saveSubtitles(projectId, formattedSubtitles);
        setLastSyncTime(new Date());

        if (showToast) {
          toast({
            title: "Subtitles synced",
            description: "Your subtitles have been saved to the server",
          });
        }

        return true;
      } catch (error) {
        handleError(error, "Failed to sync subtitles");
        return false;
      } finally {
        setIsSyncing(false);
      }
    },
    [projectId, toast, handleError],
  );

  // Toggle auto-sync feature (Pro only)
  const toggleAutoSync = useCallback(() => {
    if (!isPro) {
      toast({
        title: "Pro feature",
        description: "Upgrade to Pro to enable automatic syncing",
        variant: "destructive",
      });
      return;
    }

    setAutoSyncEnabled((prev) => !prev);
    toast({
      title: autoSyncEnabled ? "Auto-sync disabled" : "Auto-sync enabled",
      description: autoSyncEnabled
        ? "Changes will no longer be automatically saved"
        : "Changes will be automatically saved every few minutes",
    });
  }, [isPro, autoSyncEnabled, toast]);

  // Convert time format (HH:MM:SS,mmm) to milliseconds
  const timeToMs = (time: string): number => {
    const [hours, minutes, seconds] = time.split(":");
    const [secs, ms] = seconds.split(",");
    return (
      parseInt(hours) * 3600000 +
      parseInt(minutes) * 60000 +
      parseInt(secs) * 1000 +
      parseInt(ms)
    );
  };

  return {
    isSyncing,
    lastSyncTime,
    autoSyncEnabled,
    syncSubtitles,
    toggleAutoSync,
  };
}