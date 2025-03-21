import { supabase } from "@/lib/supabase";
import { Subtitle } from "./projectService";

// Parse SRT file content
export function parseSRT(content: string): Subtitle[] {
  const subtitles: Subtitle[] = [];
  const blocks = content.trim().split(/\r?\n\r?\n/);
  
  blocks.forEach((block) => {
    const lines = block.split(/\r?\n/);
    if (lines.length >= 3) {
      // Parse timecodes (format: 00:00:00,000 --> 00:00:00,000)
      const timecodes = lines[1].split(' --> ');
      if (timecodes.length === 2) {
        const startTime = timeToMilliseconds(timecodes[0]);
        const endTime = timeToMilliseconds(timecodes[1]);
        
        // Get text (could be multiple lines)
        const text = lines.slice(2).join('\n');
        
        subtitles.push({
          id: 0, // Will be assigned by database
          project_id: 0, // Will be assigned when saving
          start_time: startTime,
          end_time: endTime,
          text,
          created_at: new Date().toISOString(),
          updated_at: null
        });
      }
    }
  });
  
  return subtitles;
}

// Convert SRT time format to milliseconds
function timeToMilliseconds(timeString: string): number {
  const [time, milliseconds] = timeString.split(',');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  
  return (
    hours * 3600000 +
    minutes * 60000 +
    seconds * 1000 +
    parseInt(milliseconds)
  );
}

// Convert milliseconds to SRT time format
export function millisecondsToTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

// Generate SRT content from subtitles
export function generateSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((subtitle, index) => {
      return `${index + 1}\n${millisecondsToTime(subtitle.start_time)} --> ${millisecondsToTime(subtitle.end_time)}\n${subtitle.text}`;
    })
    .join('\n\n');
}

// Import SRT file for a project
export async function importSRT(
  projectId: number,
  srtContent: string
): Promise<Subtitle[]> {
  const subtitles = parseSRT(srtContent);
  
  // Map subtitles to include project_id
  const subtitlesToSave = subtitles.map(subtitle => ({
    start_time: subtitle.start_time,
    end_time: subtitle.end_time,
    text: subtitle.text
  }));
  
  // Save to database
  return await saveSubtitles(projectId, subtitlesToSave);
}

// Save subtitles to database (reusing your existing function)
export async function saveSubtitles(
  projectId: number,
  subtitles: Omit<Subtitle, "id" | "project_id" | "created_at" | "updated_at">[]
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