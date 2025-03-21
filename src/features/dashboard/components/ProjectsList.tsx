import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileVideo, Edit, Trash2, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserProjects, deleteProject, Project } from "@/services/projectService";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function ProjectsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userProjects = await getUserProjects(user.uid);
        setProjects(userProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your projects"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [user]);

  const handleDeleteProject = async (projectId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast({
        title: "Project deleted",
        description: "Project has been successfully deleted"
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FileVideo className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
        <p className="text-gray-500 mb-4">Create your first project to get started</p>
        <Button 
          onClick={() => navigate("/new-project")}
          className="bg-gradient-to-r from-orange-500 to-amber-500"
        >
          Create New Project
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(`/project/${project.id}`)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {project.description && (
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(project.created_at), "MMM d, yyyy")}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/project/${project.id}`);
              }}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => handleDeleteProject(project.id, e)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
