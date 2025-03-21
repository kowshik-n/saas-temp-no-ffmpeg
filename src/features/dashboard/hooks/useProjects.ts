import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUserProjects,
  Project,
  createProject,
  deleteProject,
} from "@/services/projectService";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userProjects = await getUserProjects(user.uid);
      setProjects(userProjects);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch projects"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  const addProject = async (
    title: string,
    videoUrl?: string,
    thumbnailUrl?: string,
  ) => {
    if (!user) return null;

    try {
      const newProject = await createProject(
        user.uid,
        title,
        videoUrl,
        thumbnailUrl,
      );
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      console.error("Error adding project:", err);
      throw err;
    }
  };

  const removeProject = async (projectId: number) => {
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (err) {
      console.error("Error removing project:", err);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    removeProject,
  };
}
