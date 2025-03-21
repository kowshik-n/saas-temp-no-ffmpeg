import { supabase } from "@/lib/supabase";
import { handleSupabaseError } from "@/lib/errorHandling";
import { Database } from "@/lib/supabaseTypes";

export interface Project {
  id: number;
  user_id: string;
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
    if (!userId) {
      throw new Error("User ID is required to fetch projects");
    }

    // Use the Firebase UID directly to query projects
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId) // Use Firebase UID directly
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      throw handleSupabaseError(error);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    if (error && typeof error === "object" && "code" in error) {
      throw error; // Already handled
    }
    throw handleSupabaseError(error);
  }
}

export async function getProject(projectId: number): Promise<Project> {
  try {
    if (!projectId || isNaN(projectId)) {
      throw new Error("Valid project ID is required");
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      throw handleSupabaseError(error);
    }

    if (!data) {
      throw new Error("Project not found");
    }

    return data;
  } catch (error) {
    console.error("Error fetching project:", error);
    if (error && typeof error === "object" && "code" in error) {
      throw error; // Already handled
    }
    throw handleSupabaseError(error);
  }
}

export async function createProject(
  userId: string,
  title: string,
  videoUrl?: string,
  description?: string,
): Promise<Project> {
  try {
    if (!userId) {
      throw new Error("User ID is required to create a project");
    }

    if (!title || title.trim() === "") {
      throw new Error("Project title is required");
    }

    // Use the Firebase UID directly as the user_id
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          user_id: userId, // Use Firebase UID directly
          title: title.trim(),
          description: description?.trim() || null,
          video_url: videoUrl || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      throw handleSupabaseError(error);
    }

    if (!data) {
      throw new Error("Failed to create project");
    }

    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    if (error && typeof error === "object" && "code" in error) {
      throw error; // Already handled
    }
    throw handleSupabaseError(error);
  }
}

export async function updateProject(
  projectId: number,
  updates: Partial<Project>,
): Promise<Project> {
  try {
    if (!projectId || isNaN(projectId)) {
      throw new Error("Valid project ID is required");
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("No updates provided");
    }

    // Sanitize updates to prevent unwanted fields from being updated
    const safeUpdates: Partial<Project> = {};
    const allowedFields: (keyof Project)[] = [
      "title",
      "description",
      "video_url",
    ];

    allowedFields.forEach((field) => {
      if (field in updates) {
        // @ts-ignore - We know these fields exist
        safeUpdates[field] = updates[field];
      }
    });

    const { data, error } = await supabase
      .from("projects")
      .update({
        ...safeUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      console.error("Error updating project:", error);
      throw handleSupabaseError(error);
    }

    if (!data) {
      throw new Error("Project not found or update failed");
    }

    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    if (error && typeof error === "object" && "code" in error) {
      throw error; // Already handled
    }
    throw handleSupabaseError(error);
  }
}

export async function deleteProject(projectId: number): Promise<void> {
  try {
    if (!projectId || isNaN(projectId)) {
      throw new Error("Valid project ID is required");
    }

    // First verify the project exists
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .single();

    if (projectError) {
      console.error("Error verifying project exists:", projectError);
      throw handleSupabaseError(projectError);
    }

    if (!projectData) {
      throw new Error("Project not found");
    }

    // First delete all subtitles associated with the project
    const { error: subtitlesError } = await supabase
      .from("subtitles")
      .delete()
      .eq("project_id", projectId);

    if (subtitlesError) {
      console.error("Error deleting project subtitles:", subtitlesError);
      throw handleSupabaseError(subtitlesError);
    }

    // Then delete the project
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);
      throw handleSupabaseError(error);
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    if (error && typeof error === "object" && "code" in error) {
      throw error; // Already handled
    }
    throw handleSupabaseError(error);
  }
}

export async function getProjectSubtitles(projectId: number): Promise<Subtitle[]> {
  try {
    if (!projectId || isNaN(projectId)) {
      throw new Error("Valid project ID is required");
    }

    console.log(`Fetching subtitles for project ID: ${projectId}`);
    
    // Make sure we're filtering by project_id
    const { data, error } = await supabase
      .from<"subtitles">("subtitles")
      .select("*")
      .eq("project_id", projectId)
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching subtitles:", error);
      throw handleSupabaseError(error);
    }

    console.log(`Retrieved ${data?.length || 0} subtitles for project ${projectId}`);
    return data || [];
  } catch (error) {
    console.error("Error getting project subtitles:", error);
    throw handleSupabaseError(error);
  }
}

export async function saveSubtitles(
  projectId: number,
  subtitles: Omit<
    Subtitle,
    "id" | "project_id" | "created_at" | "updated_at"
  >[],
): Promise<Subtitle[]> {
  try {
    if (!projectId || isNaN(projectId)) {
      throw new Error("Valid project ID is required");
    }

    if (!Array.isArray(subtitles)) {
      throw new Error("Subtitles must be an array");
    }

    console.log(`Saving ${subtitles.length} subtitles for project ${projectId}`);

    // Verify the project exists and user has access
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .single();

    if (projectError) {
      console.error("Error verifying project exists:", projectError);
      throw handleSupabaseError(projectError);
    }

    if (!projectData) {
      throw new Error("Project not found");
    }

    // First delete existing subtitles
    const { error: deleteError } = await supabase
      .from("subtitles")
      .delete()
      .eq("project_id", projectId);

    if (deleteError) {
      console.error("Error deleting existing subtitles:", deleteError);
      throw handleSupabaseError(deleteError);
    }

    // If no subtitles to insert, return empty array
    if (subtitles.length === 0) {
      console.log(`No subtitles to save for project ${projectId}`);
      return [];
    }

    // Then insert new subtitles
    const subtitlesToInsert = subtitles.map((subtitle) => ({
      project_id: projectId,
      start_time: subtitle.start_time,
      end_time: subtitle.end_time,
      text: subtitle.text,
      created_at: new Date().toISOString(),
    }));

    console.log(`Inserting ${subtitlesToInsert.length} subtitles for project ${projectId}`);

    const { data, error } = await supabase
      .from("subtitles")
      .insert(subtitlesToInsert)
      .select();

    if (error) {
      console.error("Error saving subtitles:", error);
      throw handleSupabaseError(error);
    }

    console.log(`Successfully saved ${data?.length || 0} subtitles for project ${projectId}`);
    return data || [];
  } catch (error) {
    console.error(`Error saving subtitles for project ${projectId}:`, error);
    if (error && typeof error === "object" && "code" in error) {
      throw error; // Already handled
    }
    throw handleSupabaseError(error);
  }
}
