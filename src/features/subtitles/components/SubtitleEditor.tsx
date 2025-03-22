import React, { useState, useEffect } from "react";
import { type Subtitle } from "../types";
import { SubtitleList } from "./SubtitleList";

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  currentSubtitleId: number | null;
  onUpdateSubtitle: (id: number, field: keyof Subtitle, value: string) => void;
  onAddSubtitle: (afterId: number) => void;
  onSplitSubtitle: (id: number) => void;
  onMergeSubtitle: (id: number) => void;
  onDeleteSubtitle: (id: number) => void;
  isPro: boolean;
  onJumpToTimestamp: (timestamp: string) => void;
  searchQuery?: string;
}

export default function SubtitleEditor({
  subtitles,
  currentSubtitleId,
  onUpdateSubtitle,
  onAddSubtitle,
  onSplitSubtitle,
  onMergeSubtitle,
  onDeleteSubtitle,
  isPro,
  onJumpToTimestamp,
  searchQuery = "",
}: SubtitleEditorProps) {
  const [filteredSubtitles, setFilteredSubtitles] = useState(subtitles);

  // Filter subtitles based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubtitles(subtitles);
    } else {
      const filtered = subtitles.filter((subtitle) =>
        subtitle.text.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredSubtitles(filtered);
    }
  }, [searchQuery, subtitles]);

  return (
    <div className="h-full flex flex-col">
      <SubtitleList
        subtitles={subtitles}
        filteredSubtitles={filteredSubtitles}
        currentSubtitleId={currentSubtitleId}
        isPro={isPro}
        onJumpToTimestamp={onJumpToTimestamp}
        onUpdateSubtitle={onUpdateSubtitle}
        onAddSubtitle={onAddSubtitle}
        onSplitSubtitle={onSplitSubtitle}
        onMergeSubtitle={onMergeSubtitle}
        onDeleteSubtitle={onDeleteSubtitle}
      />
    </div>
  );
}
