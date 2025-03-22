import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import { type Subtitle } from "../types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const SubtitleEditor = React.lazy(() => import("./SubtitleEditor"));

interface EditorWorkspaceProps {
  videoUrl: string;
  subtitles: Subtitle[];
  currentTime: number;
  currentSubtitleId: number | null;
  isPortrait: boolean;
  wordsPerSubtitle: number;
  isPro: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  srtInputRef: React.RefObject<HTMLInputElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  subtitleContainerRef: React.RefObject<HTMLDivElement>;

  onTimeUpdate: (time: number) => void;
  onImportSRT: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateSubtitle: (id: number, field: keyof Subtitle, value: string) => void;
  onAddSubtitle: (afterId: number) => void;
  onSplitSubtitle: (id: number) => void;
  onMergeSubtitle: (id: number) => void;
  onSplitAllSubtitles: () => void;
  onDeleteSubtitle: (id: number) => void;
  onDownloadSRT: () => void;
  onReset: () => void;
  setWordsPerSubtitle: (value: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function EditorWorkspace({
  videoUrl,
  subtitles,
  currentTime,
  currentSubtitleId,
  isPortrait,
  wordsPerSubtitle,
  isPro,
  fileInputRef,
  srtInputRef,
  videoRef,
  onTimeUpdate,
  onImportSRT,
  onUpdateSubtitle,
  onAddSubtitle,
  onSplitSubtitle,
  onMergeSubtitle,
  onSplitAllSubtitles,
  onDeleteSubtitle,
  onDownloadSRT,
  onReset,
  setWordsPerSubtitle,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorWorkspaceProps) {
  // Function to jump to a specific timestamp in the video
  const handleJumpToTimestamp = (timestamp: string) => {
    if (videoRef.current && timestamp) {
      // Convert timestamp format (00:00:00,000) to seconds
      const parts = timestamp.split(":");
      const seconds =
        parts.length >= 3
          ? parseInt(parts[0]) * 3600 +
            parseInt(parts[1]) * 60 +
            parseFloat(parts[2].replace(",", "."))
          : 0;

      videoRef.current.currentTime = seconds;
      onTimeUpdate(seconds);
    }
  };

  return (
<<<<<<< HEAD
    <div className="rounded-xl overflow-hidden border bg-card shadow-lg w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="">
            <div className="h-full flex">
              <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
                <div
                  className={`video-wrapper ${isPortrait ? "portrait" : ""} shadow-2xl rounded-lg overflow-hidden border border-border/50`}
                >
                  <VideoPlayer
                    videoUrl={videoUrl}
                    subtitles={subtitles}
                    currentTime={currentTime}
                    onTimeUpdate={onTimeUpdate}
                    videoRef={videoRef}
                  />
                </div>
              </div>
=======
    <div className="rounded-xl overflow-hidden border bg-card shadow-xl">
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-16rem)]">
        <ResizablePanel 
          defaultSize={65} 
          minSize={40}
          className="transition-all duration-200 ease-in-out"
        >
          <div className="h-full flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-6">
            <div
              className={`video-wrapper ${isPortrait ? "portrait" : ""} w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-border/50 transition-all duration-300`}
            >
              <VideoPlayer
                videoUrl={videoUrl}
                subtitles={subtitles}
                currentTime={currentTime}
                onTimeUpdate={onTimeUpdate}
                videoRef={videoRef}
              />
>>>>>>> c1d417c9d78471861f2884bbcf4592a2ac25c86f
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-border/50" />
        <ResizablePanel defaultSize={30} minSize={25}>
          <div className="h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/10">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="space-y-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Loading editor...
                    </p>
                  </div>
                </div>
              }
            >
              <SubtitleEditor
                subtitles={subtitles}
                currentSubtitleId={currentSubtitleId}
                onUpdateSubtitle={onUpdateSubtitle}
                onAddSubtitle={onAddSubtitle}
                onSplitSubtitle={onSplitSubtitle}
                onMergeSubtitle={onMergeSubtitle}
                onDeleteSubtitle={onDeleteSubtitle}
                isPro={isPro}
                onJumpToTimestamp={handleJumpToTimestamp}
              />
            </Suspense>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
