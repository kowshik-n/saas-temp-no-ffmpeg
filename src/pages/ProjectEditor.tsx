import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  EditorWorkspace,
  useVideoUpload,
  useSubtitles,
} from "@/features/subtitles";
import { useKeyboardShortcuts } from "@/features/subtitles/hooks/useKeyboardShortcuts";
import { usePro } from "@/context/ProContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProject, saveSubtitles } from "@/services/projectService";

export default function ProjectEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useProtectedRoute();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPro } = usePro();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Video upload and playback state
  const { videoUrl, setVideoUrl, isUploading, isPortrait, uploadVideo } = useVideoUpload();

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

  // Load project data
  useEffect(() => {
    if (!projectId || !user) return;
    
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const projectData = await getProject(Number(projectId));
        setProject(projectData);
        
        // If project has a video URL, set it
        if (projectData.video_url) {
          setVideoUrl(projectData.video_url);
        }
        
        // Load subtitles if available
        if (projectData.subtitles && projectData.subtitles.length > 0) {
          setSubtitles(projectData.subtitles);
        }
      } catch (error) {
        console.error("Error loading project:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load project data"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId, user]);

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
    if (!projectId) return;
    
    setSaving(true);
    try {
      await saveSubtitles(Number(projectId), subtitles);
      
      toast({
        title: "Project saved",
        description: "Your subtitles have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "Could not save your project. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          
          {project && (
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">{project.title}</h1>
              <Button 
                variant="default" 
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" /> 
                {saving ? "Saving..." : "Save Project"}
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <main className="container mx-auto px-1 py-1">
            {!videoUrl ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
                <p className="mb-4 text-muted-foreground">Upload a video to get started</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Upload Video
                </Button>
              </div>
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
        )}
      </div>

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
