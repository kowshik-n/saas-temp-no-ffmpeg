import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { PageLayout } from "@/components/layout/PageLayout";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  EditorWorkspace,
  ProjectStats,
  SubtitleControls,
  useVideoUpload,
  useSubtitles,
  useSubtitleSync,
} from "@/features/subtitles";
import { useKeyboardShortcuts } from "@/features/subtitles/hooks/useKeyboardShortcuts";
import { usePro } from "@/context/ProContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Upload, Loader2, Database, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getProject,
  saveSubtitles,
  getProjectSubtitles,
} from "@/services/projectService";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { msToTime, timeToMs } from "@/features/subtitles/utils";
import { Switch } from "@/components/ui/switch";

export default function ProjectEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useProtectedRoute();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPro, setIsPro } = usePro();
  const { handleError } = useErrorHandler();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get project ID as number
  const projectIdNum = projectId ? Number(projectId) : null;
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Video upload and playback state
  const { videoUrl, setVideoUrl, isUploading, isPortrait, uploadVideo } =
    useVideoUpload();

  // Subtitle sync with server
  const {
    isSyncing,
    lastSyncTime,
    autoSyncEnabled,
    syncSubtitles,
    toggleAutoSync,
  } = useSubtitleSync(projectIdNum, isPro);

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
  } = useSubtitles(isPro, projectIdNum);

  // Make sure we have a separate ref for SRT imports
  const srtInputRef = useRef<HTMLInputElement>(null);

  // Add state for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubtitles, setFilteredSubtitles] = useState<any[]>([]);
  
  // Filter subtitles based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubtitles(subtitles);
    } else {
      const filtered = subtitles.filter((subtitle) =>
        subtitle.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubtitles(filtered);
    }
  }, [searchQuery, subtitles]);

  // Load project data
  useEffect(() => {
    if (!projectId || !user) return;

    // Clear existing subtitles when loading a new project
    resetHistory([]);

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setLoadingError(null);

        // Validate projectId
        const projectIdNum = Number(projectId);
        if (isNaN(projectIdNum)) {
          throw new Error("Invalid project ID");
        }

        const projectData = await getProject(projectIdNum);

        // Verify project ownership
        if (projectData.user_id !== user.uid) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have permission to view this project",
          });
          navigate("/dashboard");
          return;
        }

        setProject(projectData);

        // If project has a video URL, set it
        if (projectData.video_url) {
          setVideoUrl(projectData.video_url);
        }
      } catch (error) {
        console.error("Error loading project:", error);
        const errorMessage = handleError(error, "Failed to load project");
        setLoadingError(errorMessage);

        // Only navigate away if it's a permission or not found error
        if (
          error instanceof Error &&
          (error.message.includes("not found") ||
            error.message.includes("permission") ||
            error.message.includes("Access Denied"))
        ) {
          navigate("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [
    projectId,
    user,
    navigate,
    toast,
    setVideoUrl,
    handleError,
    resetHistory,
  ]);

  // Auto-save effect
  useEffect(() => {
    if (!projectIdNum || !isPro || !autoSyncEnabled || subtitles.length === 0)
      return;

    const autoSaveInterval = setInterval(() => {
      syncSubtitles(subtitles, false); // Don't show toast for auto-save
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [projectIdNum, isPro, autoSyncEnabled, subtitles, syncSubtitles]);

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

  // Save project
  const handleSave = async () => {
    if (!projectIdNum || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing project information",
      });
      return;
    }

    // Verify project ownership before saving
    if (project && project.user_id !== user.uid) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to modify this project",
      });
      return;
    }

    setSaving(true);
    try {
      const success = await syncSubtitles(subtitles, true);
      if (success) {
        toast({
          title: "Project saved",
          description: "Your subtitles have been saved successfully",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle video re-upload
  const handleVideoReupload = () => {
    if (isUploading) return;

    setLoadingError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear previous selection
      fileInputRef.current.click();
    }
  };

  // Handle file upload error
  const handleUploadError = (error: Error) => {
    handleError(error, "Error uploading video");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add this effect to clear local storage when changing projects
  useEffect(() => {
    // Clear localStorage when changing projects to prevent cross-contamination
    if (projectId) {
      localStorage.removeItem("subtitle_editor_subtitles");
      console.log(`Cleared localStorage for project change to ${projectId}`);
    }
  }, [projectId]);

  // Modify the auto-loading effect
  useEffect(() => {
    if (projectIdNum && !loading && project) {
      console.log(`Auto-loading subtitles for project ${projectIdNum}`);

      // Clear any existing subtitles first
      resetHistory([]);

      // Try to load subtitles from the database first
      loadSubtitlesFromDB(projectIdNum).then((loaded) => {
        if (!loaded) {
          console.log(
            `No subtitles found in database for project ${projectIdNum}`,
          );
          toast({
            title: "No subtitles found",
            description: "This project doesn't have any saved subtitles yet.",
          });
        }
      });
    }
  }, [
    projectIdNum,
    loading,
    project,
    loadSubtitlesFromDB,
    resetHistory,
    toast,
  ]);

  // Toggle Pro mode for testing
  const toggleProMode = () => {
    setIsPro(!isPro);
    toast({
      title: isPro ? "Pro mode disabled" : "Pro mode enabled",
      description: isPro ? "Switched to free tier" : "Switched to Pro tier for testing",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageLayout containerSize="2xl" className="py-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
<<<<<<< HEAD

          <div className="flex gap-2">
            {/* Video upload button */}
            <Button
              variant="outline"
              onClick={handleVideoReupload}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Change Video</span>
                </>
              )}
            </Button>

            {/* Load saved subtitles button */}
            <Button
              variant="outline"
              onClick={() => loadSubtitlesFromDB(projectIdNum)}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  <span>Load Saved Subtitles</span>
                </>
              )}
            </Button>

            {/* Save project button */}
            <Button
              onClick={handleSave}
              disabled={saving || isSyncing}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {saving || isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  <span>Save Project</span>
                </>
              )}
            </Button>
=======
          
          <div className="flex items-center gap-4">
            {/* Pro mode toggle for testing */}
            <div className="flex items-center gap-2">
              <Crown className={`h-4 w-4 ${isPro ? "text-yellow-500" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Pro Mode</span>
              <Switch checked={isPro} onCheckedChange={toggleProMode} />
            </div>
            
            <div className="flex gap-2">
              {/* Video upload button */}
              <Button 
                variant="outline" 
                onClick={handleVideoReupload}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Change Video</span>
                  </>
                )}
              </Button>
              
              {/* Load saved subtitles button */}
              <Button 
                variant="outline" 
                onClick={() => loadSubtitlesFromDB(projectIdNum)}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    <span>Load Saved Subtitles</span>
                  </>
                )}
              </Button>
              
              {/* Save button */}
              <Button 
                onClick={handleSave}
                disabled={saving || subtitles.length === 0}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </>
                )}
              </Button>
            </div>
>>>>>>> c1d417c9d78471861f2884bbcf4592a2ac25c86f
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : loadingError ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-destructive text-xl mb-4">
              Error Loading Project
            </div>
            <p className="text-muted-foreground mb-6">{loadingError}</p>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <main className="container mx-auto px-1 py-1">
            {!videoUrl ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
                <p className="mb-4 text-muted-foreground">
                  Upload a video to get started
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Upload Video
                </Button>
              </div>
            ) : (
              <>
                {subtitles.length > 0 && <ProjectStats subtitles={subtitles} />}
                
                {/* Add SubtitleControls component here */}
                {videoUrl && (
                  <SubtitleControls
                    subtitles={subtitles}
                    onImportSRT={handleImportSRT}
                    onReset={handleReset}
                    onDownloadSRT={downloadSRT}
                    onSplitAllSubtitles={handleSplitAllSubtitles}
                    wordsPerSubtitle={wordsPerSubtitle}
                    setWordsPerSubtitle={setWordsPerSubtitle}
                    fileInputRef={srtInputRef}
                    isPro={isPro}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredCount={filteredSubtitles.length}
                    totalCount={subtitles.length}
                  />
                )}
                
                <EditorWorkspace
                  videoUrl={videoUrl}
                  subtitles={filteredSubtitles.length > 0 ? filteredSubtitles : subtitles}
                  currentTime={currentTime}
                  currentSubtitleId={currentSubtitleId}
                  isPortrait={isPortrait}
                  wordsPerSubtitle={wordsPerSubtitle}
                  isPro={isPro}
                  fileInputRef={fileInputRef}
                  srtInputRef={srtInputRef}
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
              </>
            )}
          </main>
        )}
      </PageLayout>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={uploadVideo}
        className="hidden"
        disabled={isUploading}
      />

      <input
        ref={srtInputRef}
        type="file"
        accept=".srt"
        onChange={handleImportSRT}
        className="hidden"
      />
    </div>
  );
}
