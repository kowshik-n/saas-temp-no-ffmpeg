import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, Download, Play, Pause } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  getTranscription,
  updateTranscriptionSrt,
  SrtEntry,
  formatSrtForDownload,
} from "@/services/transcriptionService";

export default function EditTranscription() {
  const { transcriptionId } = useParams<{ transcriptionId: string }>();
  const { user } = useProtectedRoute();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [transcription, setTranscription] = useState<any>(null);
  const [srtEntries, setSrtEntries] = useState<SrtEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );

  useEffect(() => {
    async function loadTranscription() {
      if (!transcriptionId || !user) return;

      try {
        setLoading(true);
        // In a real app, this would fetch from your API
        // Simulating API response
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockTranscription = {
          id: transcriptionId,
          user_id: user.uid,
          filename: "sample_audio.mp3",
          language: "en",
          status: "completed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          srt_content: [
            {
              id: 1,
              startTime: "00:00:01,000",
              endTime: "00:00:04,000",
              text: "Hello, this is a sample subtitle.",
            },
            {
              id: 2,
              startTime: "00:00:05,000",
              endTime: "00:00:08,000",
              text: "We can edit this text to fix any errors.",
            },
            {
              id: 3,
              startTime: "00:00:09,000",
              endTime: "00:00:12,000",
              text: "And then save the changes to update the SRT file.",
            },
          ],
          original_audio_url: "https://example.com/audio.mp3",
        };

        setTranscription(mockTranscription);
        setSrtEntries(mockTranscription.srt_content);
      } catch (error) {
        console.error("Error loading transcription:", error);
        toast({
          variant: "destructive",
          title: "Error loading transcription",
          description: "Could not load the transcription. Please try again.",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadTranscription();

    // Initialize audio element
    const audio = new Audio();
    setAudioElement(audio);

    return () => {
      // Cleanup audio
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [transcriptionId, user, navigate, toast]);

  const handleSave = async () => {
    if (!transcriptionId) return;

    setSaving(true);
    try {
      // In a real app, this would call your API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Changes saved",
        description: "Your subtitles have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        variant: "destructive",
        title: "Error saving changes",
        description: "Could not save your changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!transcription) return;

    const srtContent = formatSrtForDownload(srtEntries);
    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${transcription.filename.split(".")[0]}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "SRT Downloaded",
      description: `${transcription.filename.split(".")[0]}.srt has been downloaded.`,
    });
  };

  const handleTextChange = (id: number, newText: string) => {
    setSrtEntries((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, text: newText } : entry,
      ),
    );
  };

  const handleTimeChange = (
    id: number,
    field: "startTime" | "endTime",
    newTime: string,
  ) => {
    // Validate time format (HH:MM:SS,mmm)
    const timeRegex = /^\d{2}:\d{2}:\d{2},\d{3}$/;
    if (!timeRegex.test(newTime)) return;

    setSrtEntries((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: newTime } : entry,
      ),
    );
  };

  const handlePlaySegment = (id: number) => {
    if (!audioElement || !transcription?.original_audio_url) return;

    const entry = srtEntries.find((e) => e.id === id);
    if (!entry) return;

    // Parse time format (HH:MM:SS,mmm) to seconds
    const parseTime = (timeStr: string) => {
      const [hours, minutes, seconds] = timeStr.split(":");
      const [secs, ms] = seconds.split(",");
      return (
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(secs) +
        parseInt(ms) / 1000
      );
    };

    const startTime = parseTime(entry.startTime);

    if (currentlyPlaying === id) {
      // Stop playing
      audioElement.pause();
      setCurrentlyPlaying(null);
    } else {
      // Start playing this segment
      audioElement.src = transcription.original_audio_url;
      audioElement.currentTime = startTime;
      audioElement.play();
      setCurrentlyPlaying(id);

      // Stop when segment ends
      const endTime = parseTime(entry.endTime);
      const duration = endTime - startTime;
      setTimeout(() => {
        if (currentlyPlaying === id) {
          audioElement.pause();
          setCurrentlyPlaying(null);
        }
      }, duration * 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader title="Edit Transcription" />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading transcription...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Edit Transcription" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Download SRT
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{transcription?.filename}</h1>
          <p className="text-gray-500">
            {transcription?.language === "en"
              ? "English"
              : transcription?.language === "ta"
                ? "Tamil"
                : transcription?.language}
          </p>
        </div>

        <div className="space-y-4">
          {srtEntries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">
                    #{entry.id}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePlaySegment(entry.id)}
                    className="text-orange-500"
                  >
                    {currentlyPlaying === entry.id ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" /> Play
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Start Time
                    </label>
                    <Input
                      value={entry.startTime}
                      onChange={(e) =>
                        handleTimeChange(entry.id, "startTime", e.target.value)
                      }
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      End Time
                    </label>
                    <Input
                      value={entry.endTime}
                      onChange={(e) =>
                        handleTimeChange(entry.id, "endTime", e.target.value)
                      }
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Subtitle Text
                  </label>
                  <textarea
                    value={entry.text}
                    onChange={(e) => handleTextChange(entry.id, e.target.value)}
                    className="w-full p-2 border rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
