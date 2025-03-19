import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Edit } from "lucide-react";

interface Project {
  id: string;
  title: string;
  lastEdited: string;
  duration: string;
  thumbnailUrl: string;
}

interface RecentProjectsProps {
  projects: Project[];
  onContinueProject: (id: string) => void;
  isPro: boolean;
}

export function RecentProjects({
  projects = [],
  onContinueProject = () => {},
  isPro = false,
}: RecentProjectsProps) {
  if (projects.length === 0) {
    return (
      <Card className="border border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            Recent Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent projects found</p>
            <p className="text-sm mt-2">
              Your recent projects will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
          Recent Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-border/50">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-medium truncate">{project.title}</h4>
                <p className="text-xs text-muted-foreground">
                  Last edited {project.lastEdited} • {project.duration}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0"
                onClick={() => onContinueProject(project.id)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
