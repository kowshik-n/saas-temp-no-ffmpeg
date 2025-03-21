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
          start_time: sub.start_time,
          end_time: sub.end_time,
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

  // Function to load subtitles from the server
  const loadSubtitlesFromServer = useCallback(async () => {
    if (!projectId) return null;

    try {
      const subtitlesData = await getProjectSubtitles(projectId);
      setLastSyncTime(new Date());
      return subtitlesData;
    } catch (error) {
      handleError(error, "Failed to load subtitles from server");
      return null;
    }
  }, [projectId, handleError]);

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

  return {
    isSyncing,
    lastSyncTime,
    autoSyncEnabled,
    syncSubtitles,
    loadSubtitlesFromServer,
    toggleAutoSync,
  };
}
