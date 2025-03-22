import React, { useRef, useEffect } from "react";
import { Clock, Plus, GitMerge, Scissors, Trash2 } from "lucide-react";
import { type Subtitle } from "../types";
import { getWordCount } from "../utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SubtitleListProps {
  subtitles: Subtitle[];
  filteredSubtitles: Subtitle[];
  currentSubtitleId: number | null;
  isPro: boolean;
  onJumpToTimestamp: (timestamp: string) => void;
  onUpdateSubtitle: (id: number, field: keyof Subtitle, value: string) => void;
  onAddSubtitle: (afterId: number) => void;
  onSplitSubtitle: (id: number) => void;
  onMergeSubtitle: (id: number) => void;
  onDeleteSubtitle: (id: number) => void;
}

export function SubtitleList({
  subtitles,
  filteredSubtitles,
  currentSubtitleId,
  isPro,
  onJumpToTimestamp,
  onUpdateSubtitle,
  onAddSubtitle,
  onSplitSubtitle,
  onMergeSubtitle,
  onDeleteSubtitle,
}: SubtitleListProps) {
  const subtitleContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to current subtitle
  useEffect(() => {
    if (currentSubtitleId !== null && isPro) {
      const subtitleElement = document.getElementById(
        `subtitle-${currentSubtitleId}`
      );
      const container = subtitleContainerRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement | null;

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

  return (
    <ScrollArea className="flex-1 p-4" ref={subtitleContainerRef}>
      <div className="space-y-4">
        {filteredSubtitles.map((subtitle) => (
          <Card
            id={`subtitle-${subtitle.id}`}
            key={subtitle.id}
            className={cn(
              "p-4 transition-all duration-200 hover:shadow-md cursor-pointer",
              currentSubtitleId === subtitle.id && "ring-2 ring-primary"
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
                        e.target.value
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
  );
} 