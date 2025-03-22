import React from "react";
import {
  Download,
  Upload,
  RefreshCw,
  Scissors,
  Search,
} from "lucide-react";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { UndoRedoButtons } from "./UndoRedoButtons";
import { type Subtitle } from "../types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubtitleControlsProps {
  subtitles: Subtitle[];
  onImportSRT: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onDownloadSRT: () => void;
  onSplitAllSubtitles: () => void;
  wordsPerSubtitle: number;
  setWordsPerSubtitle: (value: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isPro: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCount?: number;
  totalCount?: number;
}

export function SubtitleControls({
  subtitles,
  onImportSRT,
  onReset,
  onDownloadSRT,
  onSplitAllSubtitles,
  wordsPerSubtitle,
  setWordsPerSubtitle,
  fileInputRef,
  isPro,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  searchQuery,
  setSearchQuery,
  filteredCount,
  totalCount,
}: SubtitleControlsProps) {
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
    <div className="mb-4 p-4 border rounded-lg bg-background">
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
            onClick={onReset}
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
            {searchQuery && filteredCount !== undefined && totalCount !== undefined && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                {filteredCount} of {totalCount}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 