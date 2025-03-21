import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { EditorWorkspace } from "@/features/subtitles";
import { useSubtitles } from "@/features/subtitles/hooks/useSubtitles";
import { useKeyboardShortcuts } from "@/features/subtitles/hooks/useKeyboardShortcuts";
import { usePro } from "@/context/ProContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useProtectedRoute();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPro } = usePro();

  const [currentTime, setCurrentTime] = useState(0);
  const [saving, setSaving] = useState(false);

  // Video player reference
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subtitle state and handlers
  const {
    subtitles,
    currentSubtitleId,
    wordsPerSubtitle,
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
  } = useSubtitles(isPro);

  // Handle time updates from video player
  const onTimeUpdate = (time: number) => {
    setCurrentTime(time);
    handleTimeUpdate(time);
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    videoRef,
    subtitles,
    currentSubtitleId,
    onAddSubtitle: addNewSubtitle,
    onSplitSubtitle: splitSubtitle,
    onMergeSubtitle: mergeSubtitles,
    onDeleteSubtitle: deleteSubtitle,
    onDownloadSRT: downloadSRT,
    isPro,
  });

  // Save subtitles
  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Saved successfully",
        description: "Your subtitles have been saved",
      });
    } catch (error) {
      console.error("Error saving subtitles:", error);
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "Could not save your subtitles. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Sample video URL for demo purposes
  const videoUrl =
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <EditorWorkspace
          videoUrl={videoUrl}
          subtitles={subtitles}
          currentTime={currentTime}
          currentSubtitleId={currentSubtitleId}
          isPortrait={false}
          wordsPerSubtitle={wordsPerSubtitle}
          isPro={isPro}
          videoRef={videoRef}
          onTimeUpdate={onTimeUpdate}
          onImportSRT={handleImportSRT}
          onUpdateSubtitle={updateSubtitle}
          onAddSubtitle={addNewSubtitle}
          onSplitSubtitle={splitSubtitle}
          onMergeSubtitle={mergeSubtitles}
          onSplitAllSubtitles={handleSplitAllSubtitles}
          onDeleteSubtitle={deleteSubtitle}
          onDownloadSRT={downloadSRT}
          onReset={handleReset}
          setWordsPerSubtitle={setWordsPerSubtitle}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>
    </div>
  );
}
