import React from "react";
import { Card } from "@/components/ui/card";
import { FileVideo, Wand2 } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isNew?: boolean;
  onClick: () => void;
}

function ProjectCard({
  title,
  description,
  icon,
  isNew = false,
  onClick,
}: ProjectCardProps) {
  return (
    <Card
      className="relative flex flex-col items-center p-6 border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden hover:border-orange-200 hover:scale-[1.01] bg-background"
      onClick={onClick}
    >
      {isNew && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
          New
        </div>
      )}
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </Card>
  );
}

interface NewProjectSectionProps {
  onUploadVideo: () => void;
  onGenerateMagicClips: () => void;
  isPro: boolean;
}

export function NewProjectSection({
  onUploadVideo = () => {},
  onGenerateMagicClips = () => {},
  isPro = false,
}: NewProjectSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-5 text-foreground/90">
        New Project
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProjectCard
          title="Generate Captions"
          description="Add trendy captions & b-rolls"
          icon={
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50">
              <img
                src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&q=80"
                alt="Video thumbnail"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <FileVideo className="h-8 w-8 text-white" />
              </div>
            </div>
          }
          onClick={onUploadVideo}
        />
        <ProjectCard
          title="Magic clips"
          description="Get clips from long video"
          icon={
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50">
              <img
                src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&q=80"
                alt="Magic clips thumbnail"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Wand2 className="h-8 w-8 text-white" />
              </div>
            </div>
          }
          isNew={true}
          onClick={onGenerateMagicClips}
        />
      </div>
    </div>
  );
}
