import React, { useState, useRef } from "react";
import { AppHeader } from "@/features/landing";
import {
  EditorWorkspace,
  useVideoUpload,
  useSubtitles,
} from "@/features/subtitles";
import { UserDashboard } from "@/features/dashboard";
import { useKeyboardShortcuts } from "@/features/subtitles/hooks/useKeyboardShortcuts";
import { usePro } from "@/context/ProContext";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function Home() {
  // Use the Pro context instead of local state
  const { isPro, setIsPro } = usePro();
  const { user } = useAuth();

  // Video upload and playback state
  const { videoUrl, isUploading, isPortrait, uploadVideo } = useVideoUpload();

  // Video player reference
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current video playback time
  const [currentTime, setCurrentTime] = useState(0);

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader isPro={isPro} setIsPro={setIsPro} />

      <main className="container mx-auto px-1 py-1">
        {!videoUrl ? (
          <UserDashboard
            isPro={isPro}
            fileInputRef={fileInputRef}
            isUploading={isUploading}
            onImportSRT={handleImportSRT}
          />
        ) : (
          <EditorWorkspace
            videoUrl={videoUrl}
            subtitles={subtitles}
            currentTime={currentTime}
            currentSubtitleId={currentSubtitleId}
            isPortrait={isPortrait}
            wordsPerSubtitle={wordsPerSubtitle}
            isPro={isPro}
            fileInputRef={fileInputRef}
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
        )}
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={uploadVideo}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}

export default Home;
