import { supabase } from "@/lib/supabase";

export interface SrtEntry {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface TranscriptionFile {
  id: string;
  user_id: string;
  filename: string;
  language: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  srt_content: SrtEntry[];
  original_audio_url?: string;
}

// Get all transcription files for a user
export async function getUserTranscriptions(
  userId: string,
): Promise<TranscriptionFile[]> {
  const { data, error } = await supabase
    .from("transcriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transcriptions:", error);
    throw error;
  }

  return data || [];
}

// Get a single transcription file
export async function getTranscription(id: string): Promise<TranscriptionFile> {
  const { data, error } = await supabase
    .from("transcriptions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching transcription:", error);
    throw error;
  }

  return data;
}

// Create a new transcription request
export async function createTranscriptionRequest(
  userId: string,
  filename: string,
  language: string,
  audioFile: File,
): Promise<string> {
  // 1. Create a record in the database
  const { data, error } = await supabase
    .from("transcriptions")
    .insert([
      {
        user_id: userId,
        filename,
        language,
        status: "processing",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        srt_content: [],
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating transcription request:", error);
    throw error;
  }

  const transcriptionId = data.id;

  // 2. Upload the audio file to storage
  const filePath = `audio/${userId}/${transcriptionId}/${filename}`;
  const { error: uploadError } = await supabase.storage
    .from("audio-uploads")
    .upload(filePath, audioFile);

  if (uploadError) {
    console.error("Error uploading audio file:", uploadError);
    // Update the status to failed
    await supabase
      .from("transcriptions")
      .update({ status: "failed" })
      .eq("id", transcriptionId);
    throw uploadError;
  }

  // 3. Trigger the transcription process via a serverless function
  // In a real implementation, this would call an AWS Lambda function or similar
  // that would process the audio with AWS Transcribe
  try {
    const response = await fetch("/api/process-transcription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcriptionId,
        filePath,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to start transcription process");
    }
  } catch (processError) {
    console.error("Error starting transcription process:", processError);
    // We don't throw here because the request has been created and will be processed asynchronously
  }

  return transcriptionId;
}

// Update an existing transcription's SRT content
export async function updateTranscriptionSrt(
  transcriptionId: string,
  srtContent: SrtEntry[],
): Promise<void> {
  const { error } = await supabase
    .from("transcriptions")
    .update({
      srt_content: srtContent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", transcriptionId);

  if (error) {
    console.error("Error updating transcription SRT:", error);
    throw error;
  }
}

// Format SRT entries to standard SRT format for download
export function formatSrtForDownload(entries: SrtEntry[]): string {
  return entries
    .map((entry, index) => {
      return `${index + 1}\n${entry.startTime} --> ${entry.endTime}\n${entry.text}\n`;
    })
    .join("\n");
}

// Parse SRT string to SrtEntry array
export function parseSrtContent(srtString: string): SrtEntry[] {
  const blocks = srtString.trim().split("\n\n");
  return blocks.map((block, index) => {
    const lines = block.split("\n");
    // Skip the sequence number (lines[0])
    const timeCode = lines[1];
    const [startTime, endTime] = timeCode.split(" --> ");
    const text = lines.slice(2).join("\n");

    return {
      id: index + 1,
      startTime,
      endTime,
      text,
    };
  });
}

// Delete a transcription and its associated audio file
export async function deleteTranscription(
  transcriptionId: string,
  userId: string,
): Promise<void> {
  // 1. Get the transcription to find the file path
  const { data, error } = await supabase
    .from("transcriptions")
    .select("filename")
    .eq("id", transcriptionId)
    .single();

  if (error) {
    console.error("Error fetching transcription for deletion:", error);
    throw error;
  }

  // 2. Delete the audio file from storage
  const filePath = `audio/${userId}/${transcriptionId}/${data.filename}`;
  const { error: storageError } = await supabase.storage
    .from("audio-uploads")
    .remove([filePath]);

  if (storageError) {
    console.error("Error deleting audio file:", storageError);
    // Continue with deletion of the database record even if storage deletion fails
  }

  // 3. Delete the transcription record
  const { error: deleteError } = await supabase
    .from("transcriptions")
    .delete()
    .eq("id", transcriptionId);

  if (deleteError) {
    console.error("Error deleting transcription record:", deleteError);
    throw deleteError;
  }
}
