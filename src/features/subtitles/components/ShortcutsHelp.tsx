import React from "react";
import {
  Keyboard,
  HelpCircle,
  Play,
  Plus,
  Scissors,
  GitMerge,
  Trash2,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShortcutsHelpProps {
  isPro: boolean;
}

export function ShortcutsHelp({ isPro }: ShortcutsHelpProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          <span>Keyboard Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to speed up your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Video Controls</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-muted-foreground" />
                <span>Play/Pause</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Subtitle Editing</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl/⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span>Add Subtitle</span>
              </div>

              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl/⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">
                  Delete/Backspace
                </kbd>
              </div>
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
                <span>Delete Subtitle</span>
              </div>

              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl/⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">S</kbd>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span>Export SRT</span>
              </div>

              {isPro && (
                <>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">
                      Ctrl/⌘
                    </kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">D</kbd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-muted-foreground" />
                    <span>Split Subtitle</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">
                      Ctrl/⌘
                    </kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">M</kbd>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitMerge className="h-4 w-4 text-muted-foreground" />
                    <span>Merge Subtitle</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {!isPro && (
            <div className="mt-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Upgrade to Pro to unlock additional shortcuts</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
