import { useCallback } from "react";
import { type Subtitle } from "../types";

export function useSubtitleAnalytics() {
  // Calculate statistics about the subtitles
  const calculateStats = useCallback((subtitles: Subtitle[]) => {
    if (!subtitles.length) {
      return {
        totalSubtitles: 0,
        totalWords: 0,
        totalDuration: 0,
        averageWordsPerSubtitle: 0,
        averageSubtitleDuration: 0,
        wordsPerMinute: 0,
      };
    }

    // Calculate total words
    const totalWords = subtitles.reduce((sum, subtitle) => {
      return sum + subtitle.text.trim().split(/\s+/).filter(Boolean).length;
    }, 0);

    // Calculate total duration in seconds
    let totalDuration = 0;
    subtitles.forEach((subtitle) => {
      const startParts = subtitle.startTime.split(":");
      const endParts = subtitle.endTime.split(":");

      const startSeconds =
        parseInt(startParts[0]) * 3600 +
        parseInt(startParts[1]) * 60 +
        parseFloat(startParts[2].replace(",", "."));

      const endSeconds =
        parseInt(endParts[0]) * 3600 +
        parseInt(endParts[1]) * 60 +
        parseFloat(endParts[2].replace(",", "."));

      totalDuration += endSeconds - startSeconds;
    });

    // Calculate averages
    const averageWordsPerSubtitle = totalWords / subtitles.length;
    const averageSubtitleDuration = totalDuration / subtitles.length;

    // Calculate words per minute
    const wordsPerMinute =
      totalDuration > 0 ? (totalWords / totalDuration) * 60 : 0;

    return {
      totalSubtitles: subtitles.length,
      totalWords,
      totalDuration,
      averageWordsPerSubtitle,
      averageSubtitleDuration,
      wordsPerMinute,
    };
  }, []);

  // Format duration in seconds to a readable format
  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }, []);

  return {
    calculateStats,
    formatDuration,
  };
}
