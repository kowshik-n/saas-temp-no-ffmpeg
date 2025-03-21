import React, { useState, useRef } from "react";
import {
  Clock,
  Download,
  Plus,
  GitMerge,
  Scissors,
  Upload,
  RefreshCw,
  Trash2,
  Search,
} from "lucide-react";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { ProjectStats } from "./ProjectStats";
import { UndoRedoButtons } from "./UndoRedoButtons";
import { type Subtitle } from "../types";
import { getWordCount } from "../utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  currentSubtitleId: number | null;
  onImportSRT: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateSubtitle: (id: number, field: keyof Subtitle, value: string) => void;
  onAddSubtitle: (afterId: number) => void;
  onSplitSubtitle: (id: number) => void;
  onMergeSubtitle: (id: number) => void;
  onSplitAllSubtitles: () => void;
  onDeleteSubtitle: (id: number) => void;
  onDownloadSRT: () => void;
  onReset: () => void;
  wordsPerSubtitle: number;
  setWordsPerSubtitle: (value: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isPro: boolean;
  onJumpToTimestamp: (timestamp: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function SubtitleEditor({
  subtitles,
  currentSubtitleId,
  onImportSRT,
  onUpdateSubtitle,
  onAddSubtitle,
  onSplitSubtitle,
  onMergeSubtitle,
  onSplitAllSubtitles,
  onDeleteSubtitle,
  onDownloadSRT,
  onReset,
  wordsPerSubtitle,
  setWordsPerSubtitle,
  fileInputRef,
  isPro,
  onJumpToTimestamp,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: SubtitleEditorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubtitles, setFilteredSubtitles] = useState(subtitles);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);

  // Filter subtitles based on search query
  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubtitles(subtitles);
    } else {
      const filtered = subtitles.filter((subtitle) =>
        subtitle.text.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredSubtitles(filtered);
    }
  }, [searchQuery, subtitles]);

  // Scroll to current subtitle
  React.useEffect(() => {
    if (currentSubtitleId !== null && isPro) {
      const subtitleElement = document.getElementById(
        `subtitle-${currentSubtitleId}`,
      );
      const container = subtitleContainerRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]",
      );

      if (subtitleElement && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = subtitleElement.getBoundingClientRect();

        const scrollTop =
          subtitleElement.offsetTop -
          container.offsetTop -
          containerRect.height / 2 +
          elementRect.height / 2;

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [currentSubtitleId, isPro]);

  const canSplitSubtitle = (text: string) => {
    return getWordCount(text) > 1;
  };

  // Handle SRT import button click
  const handleImportSRTClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Make sure we're using the correct file input
    if (fileInputRef && fileInputRef.current) {
      // Clear any previous selection
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {subtitles.length > 0 && <ProjectStats subtitles={subtitles} />}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="secondary"
              onClick={handleImportSRTClick}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Import SRT
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                onReset();
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>

            {subtitles.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={onDownloadSRT}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export SRT
                </Button>
                <UndoRedoButtons
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={onUndo}
                  onRedo={onRedo}
                />
                <ShortcutsHelp isPro={isPro} />
              </>
            )}
          </div>
          {subtitles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={wordsPerSubtitle.toString()}
                onValueChange={(value) => setWordsPerSubtitle(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Words per subtitle" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "word" : "words"} per subtitle
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={onSplitAllSubtitles}
                className="gap-2"
                disabled={!isPro}
              >
                <Scissors className="h-4 w-4" />
                Split All
                {!isPro && <span className="ml-1 text-xs">(Pro)</span>}
              </Button>
            </div>
          )}
        </div>

        {subtitles.length > 0 && (
          <div className="mt-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search subtitles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                  {filteredSubtitles.length} of {subtitles.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={subtitleContainerRef}>
        <div className="space-y-4">
          {filteredSubtitles.map((subtitle) => (
            <Card
              id={`subtitle-${subtitle.id}`}
              key={subtitle.id}
              className={cn(
                "p-4 transition-all duration-200 hover:shadow-md cursor-pointer",
                currentSubtitleId === subtitle.id && "ring-2 ring-primary",
              )}
              onClick={() => {
                onJumpToTimestamp(subtitle.startTime);
              }}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium">In</span>
                    <input
                      type="text"
                      value={subtitle.startTime}
                      onChange={(e) =>
                        onUpdateSubtitle(
                          subtitle.id,
                          "startTime",
                          e.target.value,
                        )
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className="text-sm font-medium">Out</span>
                    <input
                      type="text"
                      value={subtitle.endTime}
                      onChange={(e) =>
                        onUpdateSubtitle(subtitle.id, "endTime", e.target.value)
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      {subtitle.endTime}
                    </span>
                  </div>
                </div>

                <textarea
                  value={subtitle.text}
                  onChange={(e) =>
                    onUpdateSubtitle(subtitle.id, "text", e.target.value)
                  }
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  rows={2}
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSubtitle(subtitle.id);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMergeSubtitle(subtitle.id);
                    }}
                    className="gap-2"
                    disabled={!isPro}
                  >
                    <GitMerge className="h-4 w-4" />
                    Merge
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSplitSubtitle(subtitle.id);
                    }}
                    disabled={!canSplitSubtitle(subtitle.text) || !isPro}
                    className="gap-2"
                  >
                    <Scissors className="h-4 w-4" />
                    Split
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSubtitle(subtitle.id);
                    }}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Removed multi-select merge functionality */}
    </div>
  );
}
