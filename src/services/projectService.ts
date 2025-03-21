import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export interface Project {
  id: number;
  title: string;
  description: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Subtitle {
  id: number;
  project_id: number;
  start_time: number;
  end_time: number;
  text: string;
  created_at: string;
  updated_at: string | null;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    // Use the Firebase UID directly to query projects
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId) // Use Firebase UID directly
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function getProject(projectId: number): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    throw error;
  }

  return data;
}

export async function createProject(
  userId: string,
  title: string,
  videoUrl?: string,
  description?: string
): Promise<Project> {
  try {
    // Use the Firebase UID directly as the user_id
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          user_id: userId, // Use Firebase UID directly
          title,
          description,
          video_url: videoUrl,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(
  projectId: number,
  updates: Partial<Project>,
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw error;
  }

  return data;
}

export async function deleteProject(projectId: number): Promise<void> {
  // First delete all subtitles associated with the project
  const { error: subtitlesError } = await supabase
    .from("subtitles")
    .delete()
    .eq("project_id", projectId);

  if (subtitlesError) {
    console.error("Error deleting project subtitles:", subtitlesError);
    throw subtitlesError;
  }

  // Then delete the project
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

export async function getProjectSubtitles(
  projectId: number,
): Promise<Subtitle[]> {
  const { data, error } = await supabase
    .from("subtitles")
    .select("*")
    .eq("project_id", projectId)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching subtitles:", error);
    throw error;
  }

  return data || [];
}

export async function saveSubtitles(
  projectId: number,
  subtitles: Omit<
    Subtitle,
    "id" | "project_id" | "created_at" | "updated_at"
  >[],
): Promise<Subtitle[]> {
  // First delete existing subtitles
  const { error: deleteError } = await supabase
    .from("subtitles")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    console.error("Error deleting existing subtitles:", deleteError);
    throw deleteError;
  }

  // Then insert new subtitles
  const subtitlesToInsert = subtitles.map((subtitle) => ({
    project_id: projectId,
    start_time: subtitle.start_time,
    end_time: subtitle.end_time,
    text: subtitle.text,
    created_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("subtitles")
    .insert(subtitlesToInsert)
    .select();

  if (error) {
    console.error("Error saving subtitles:", error);
    throw error;
  }

  return data || [];
}
