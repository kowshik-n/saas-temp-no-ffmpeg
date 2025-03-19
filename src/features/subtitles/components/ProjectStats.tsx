import React, { useMemo } from "react";
import { Subtitle } from "../types";
import { getWordCount } from "../utils";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, MessageSquare } from "lucide-react";

interface ProjectStatsProps {
  subtitles: Subtitle[];
}

export function ProjectStats({ subtitles }: ProjectStatsProps) {
  const stats = useMemo(() => {
    if (subtitles.length === 0) return null;

    // Calculate total duration
    let totalDurationMs = 0;
    subtitles.forEach((sub) => {
      const startParts = sub.startTime.split(",");
      const endParts = sub.endTime.split(",");

      const startTime =
        startParts[0].split(":").reduce((acc, time, i) => {
          return acc + parseInt(time) * Math.pow(60, 2 - i) * 1000;
        }, 0) + parseInt(startParts[1]);

      const endTime =
        endParts[0].split(":").reduce((acc, time, i) => {
          return acc + parseInt(time) * Math.pow(60, 2 - i) * 1000;
        }, 0) + parseInt(endParts[1]);

      totalDurationMs += endTime - startTime;
    });

    // Calculate total words
    const totalWords = subtitles.reduce((acc, sub) => {
      return acc + getWordCount(sub.text);
    }, 0);

    // Calculate words per minute
    const durationMinutes = totalDurationMs / (1000 * 60);
    const wpm = Math.round(totalWords / (durationMinutes || 1));

    return {
      subtitleCount: subtitles.length,
      totalWords,
      totalDuration: formatDuration(totalDurationMs),
      wpm,
    };
  }, [subtitles]);

  if (!stats) return null;

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Subtitles</span>
            </div>
            <span className="text-xl font-bold">{stats.subtitleCount}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Words</span>
            </div>
            <span className="text-xl font-bold">{stats.totalWords}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Duration</span>
            </div>
            <span className="text-xl font-bold">{stats.totalDuration}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">Words/Min</span>
            </div>
            <span className="text-xl font-bold">{stats.wpm}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
}
