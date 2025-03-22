import React, { useState, useRef } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileVideo, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components/ui/container";
import { PageLayout } from "@/components/layout/PageLayout";

export default function NewProject() {
  useProtectedRoute();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createProject, isLoading } = useProjectActions();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create object URL for the video file if it exists
    let videoUrl = undefined;
    if (videoFile) {
      videoUrl = URL.createObjectURL(videoFile);
      // In a real app, you would upload the file to storage here
      // and use the returned URL instead of an object URL
    }

    const newProject = await createProject(
      title,
      videoUrl,
      description || undefined,
    );

    if (newProject) {
      // Navigate to the editor for the new project
      navigate(`/project/${newProject.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <PageLayout containerSize="2xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Project</CardTitle>
            <CardDescription>
              Start a new subtitle project by uploading a video or creating an
              empty project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Video (Optional)</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {videoFile ? (
                    <div className="space-y-2">
                      <FileVideo className="h-10 w-10 mx-auto text-orange-500" />
                      <p className="text-sm font-medium">{videoFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="text-sm font-medium">
                        Click to upload a video
                      </p>
                      <p className="text-xs text-gray-500">
                        MP4, WebM, or MOV up to 500MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Project..." : "Create Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PageLayout>
    </div>
  );
}
