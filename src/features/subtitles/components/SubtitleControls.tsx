import React from "react";
import {
  Download,
  Upload,
  RefreshCw,
  Scissors,
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
    </div>
  );
} 