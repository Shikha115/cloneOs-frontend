import React, { useMemo, useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import {
  useGetAllProjects,
  useCreateProject,
  useGenerateScript,
} from "../../../../services/project.service";
import { useUser } from "../../../../store/auth.store";
import { useProjectStore, useSelectedProjectId } from "../../../../store/project.store";
import { useStoryboardStore } from "../../../../store/storyboard.store";
import { useToast } from "../../../../hooks/use-toast";
import ProjectSkeleton from "./Skeleton";
import ProjectCard from "./ProjectCard";

export default function ProjectSection({
  sectionRef,
  onNext,
}) {
  const user = useUser();
  const { toast } = useToast();
  const selectedProjectId = useSelectedProjectId();
  const { 
    setSelectedProjectId, 
    setProjectName, 
    clearSelectedProject,
    projects: cachedProjects,
    setProjects,
    projectsLastFetched,
    isCacheFresh,
    addProject,
  } = useProjectStore();
  const { frames, setFrames, setGeneratingScript } = useStoryboardStore();
  const { mutateAsync: generateScript } = useGenerateScript();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  
  const shouldFetch = !isCacheFresh(projectsLastFetched);
  const { data: fetchedProjects = [], isLoading, error } = useGetAllProjects({
    enabled: shouldFetch,
  });
  
  useEffect(() => {
    if (fetchedProjects.length > 0) {
      const sorted = [...fetchedProjects].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      });
      setProjects(sorted);
    }
  }, [fetchedProjects, setProjects]);

  useEffect(() => {
    if (frames.length == 0) {
      setSelectedProjectId("");
    }
  }, []);
  
  const projects = cachedProjects.length > 0 ? cachedProjects : fetchedProjects;

  const handleSelect = async (project) => {
    setSelectedProjectId(project.id);
    
    // Scroll to storyboard section immediately when project is selected
    onNext?.('storyboard');
    
    // Check if project already has scenes/frames
    const hasScenes = project.scenes && project.scenes.length > 0;
    
    // Check if project has scriptText
    const hasScriptText = project.scriptText && project.scriptText.trim().length > 0;
    
    if (hasScenes) {
      // Project already has scenes, set frames and go to storyboard
      const frames = (project.scenes || []).map((scene, idx) => ({
        id: scene.id || `scene-${idx}`,
        scene: scene.scene || `Scene ${scene.sequenceOrder ?? idx + 1}`,
        scriptText: scene.scriptText || scene.aiPrompt || 'No description',
        sketchUrl: scene.sketchUrl || null,
        finalImageUrl: scene.finalImageUrl || null,
        aiPrompt: scene.aiPrompt || null,
        status: scene.status || 'pending',
        sequenceOrder: scene.sequenceOrder ?? idx + 1,
        isLocked: false,
      }));
      setFrames(frames);
    } else if (!hasScriptText) {
      // Project has no scriptText, scroll to upload script section
      toast({
        title: "Script required",
        description: "Please write a script for this project.",
      });
      onNext?.('upload-script');
    } else {
      // Project has scriptText but no scenes, call generate script API
      try {
        setGeneratingScript(true);
        toast({
          title: "Generating script",
          description: "Please wait while we process your project...",
        });
        
        const prompt = project.scriptText;
        const res = await generateScript({ projectId: project.id, prompt });
        setGeneratingScript(false);
        
        const scenes = res?.data ?? res?.scenes ?? res ?? [];
        const frames = (scenes || []).map((scene, idx) => ({
          id: scene.id || `scene-${idx}`,
          scene: scene.scene || `Scene ${scene.sequenceOrder ?? idx + 1}`,
          scriptText: scene.scriptText || scene.aiPrompt || 'No description',
          sketchUrl: scene.sketchUrl || null,
          finalImageUrl: scene.finalImageUrl || null,
          aiPrompt: scene.aiPrompt || null,
          status: scene.status || 'pending',
          sequenceOrder: scene.sequenceOrder ?? idx + 1,
          isLocked: false,
        }));
        setFrames(frames);
        toast({
          title: "Script generated",
          description: "Your storyboard is ready.",
        });
      } catch (error) {
        setGeneratingScript(false);
        toast({
          title: "Generation failed",
          description: error?.message || "Unable to generate script for this project.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name.",
        variant: "destructive",
      });
      return;
    }
    
    clearSelectedProject();
    setProjectName(newProjectName.trim());
    setShowCreateDialog(false);
    setNewProjectName("");
    
    toast({
      title: "Project setup started",
      description: "Please select an actor and upload your script.",
    });
    
    onNext?.();
  };

  const renderBody = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, idx) => (
        <ProjectSkeleton key={idx} />
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center text-red-500 py-8">
          <p>Unable to load projects. Please try again.</p>
        </div>
      );
    }

    if (!projects || projects.length === 0) {
      return (
        <div className="col-span-full text-center text-gray-400 py-8">
          <p>No projects found for your account.</p>
        </div>
      );
    }

    return projects.slice(0, 8).map((project) => (
      <ProjectCard
        key={project.id}
        project={project}
        selected={selectedProjectId === project.id}
        onSelect={() => handleSelect(project)}
      />
    ));
  };

  return (
    <section ref={sectionRef} className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">SELECT PROJECT</h2>
        <Button
          variant="default"
          className="section-badge"
          onClick={() => setShowCreateDialog(true)}
        >
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">{renderBody()}</div>

      <Dialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      >
        <DialogContent className="bg-black border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter a name for your new project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="bg-gray-900 border-gray-800 text-white placeholder-gray-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateProject();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewProjectName("");
                }} 
                className="border-gray-800 hover:bg-gray-900"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
