import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { useErrorHandler } from "./useErrorHandler";
import { useAuth } from "@/context/AuthContext";
import {
  createProject,
  deleteProject,
  updateProject,
  type Project,
} from "@/services/projectService";

export function useProjectActions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = useCallback(
    async (title: string, videoUrl?: string, description?: string) => {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to create a project",
        });
        navigate("/login");
        return null;
      }

      if (!title.trim()) {
        toast({
          variant: "destructive",
          title: "Title required",
          description: "Please enter a title for your project",
        });
        return null;
      }

      setIsLoading(true);
      try {
        const newProject = await createProject(
          user.uid,
          title,
          videoUrl,
          description,
        );

        toast({
          title: "Project created",
          description: `"${title}" has been created successfully`,
        });

        return newProject;
      } catch (error) {
        handleError(error, "Failed to create project");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, toast, navigate, handleError],
  );

  const handleUpdateProject = useCallback(
    async (projectId: number, updates: Partial<Project>) => {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to update this project",
        });
        navigate("/login");
        return null;
      }

      setIsLoading(true);
      try {
        const updatedProject = await updateProject(projectId, updates);

        // Verify ownership after update
        if (updatedProject.user_id !== user.uid) {
          throw new Error("You don't have permission to modify this project");
        }

        toast({
          title: "Project updated",
          description: "Your project has been updated successfully",
        });

        return updatedProject;
      } catch (error) {
        handleError(error, "Failed to update project");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, toast, navigate, handleError],
  );

  const handleDeleteProject = useCallback(
    async (projectId: number) => {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to delete this project",
        });
        navigate("/login");
        return false;
      }

      setIsLoading(true);
      try {
        await deleteProject(projectId);

        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully",
        });

        return true;
      } catch (error) {
        handleError(error, "Failed to delete project");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, toast, navigate, handleError],
  );

  return {
    isLoading,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
  };
}
