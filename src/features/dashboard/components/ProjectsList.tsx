import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, LayoutGrid } from "lucide-react";

interface ProjectsListProps {
  onUpload: () => void;
}

export function ProjectsList({ onUpload = () => {} }: ProjectsListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-foreground/90">All Projects</h2>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <select
              className="bg-background border border-border/50 rounded-md px-3 py-1 text-sm"
              defaultValue="all"
            >
              <option value="all">Type: All</option>
              <option value="captions">Captions</option>
              <option value="clips">Clips</option>
            </select>
            <select
              className="bg-background border border-border/50 rounded-md px-3 py-1 text-sm"
              defaultValue="all"
            >
              <option value="all">Status: All</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
            <select
              className="bg-background border border-border/50 rounded-md px-3 py-1 text-sm"
              defaultValue="active"
            >
              <option value="active">Filter by: Active</option>
              <option value="archived">Archived</option>
            </select>
            <select
              className="bg-background border border-border/50 rounded-md px-3 py-1 text-sm"
              defaultValue="newest"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </select>
          </div>
          <Button variant="ghost" size="icon">
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-10 text-center border border-border/30 shadow-sm">
        <p className="text-muted-foreground mb-5 text-lg">
          No projects in this folder
        </p>
        <Button
          onClick={onUpload}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm transition-all"
        >
          <Upload className="h-4 w-4 mr-2" /> Upload here
        </Button>
      </div>
    </div>
  );
}
