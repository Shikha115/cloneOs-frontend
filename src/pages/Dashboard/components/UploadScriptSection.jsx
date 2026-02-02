import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Upload, RefreshCw } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import { useGenerateScript, useCreateProject } from '../../../services/project.service';
import { useStoryboardStore } from '../../../store/storyboard.store';
import { useProjectStore, useSelectedProjectId, useSelectedActorId, useProjectName, useProjects } from '../../../store/project.store';
import { useUser } from '../../../store/auth.store';

export default function UploadScriptSection({ sectionRef, onFramesReady }) {
  const { toast } = useToast();
  const user = useUser();
  const selectedProjectId = useSelectedProjectId();
  const selectedActorId = useSelectedActorId();
  const projectName = useProjectName();
  const projects = useProjects();
  const { setSelectedProjectId, addProject } = useProjectStore();
  const [script, setScript] = useState('');
  const { frames, setFrames, setGeneratingScript } = useStoryboardStore();
  const { mutateAsync: createProject, isPending: creatingProject } = useCreateProject();
  const { mutateAsync: generateScript, isPending: generatingScript } = useGenerateScript();

  // Get the selected project's existing script
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const existingScriptText = selectedProject?.scriptText || '';

  const buttonLabel = useMemo(() => {
    if (creatingProject) return 'Creating Project...';
    if (generatingScript) return 'Generating Script...';
    return 'Generate Script';
  }, [creatingProject, generatingScript]);

  const handleGenerateScript = async () => {
    // Use existing script if available, otherwise use the script state
    const prompt = script.trim() || existingScriptText;

    if (!prompt) {
      toast({ title: 'Script required', description: 'Please enter a script.', variant: 'destructive' });
      return;
    }

    const userId = user?.id ?? user?._id;
    if (!userId) {
      toast({ title: 'User not found', description: 'Please log in to create a project.', variant: 'destructive' });
      return;
    }

    try {
      setGeneratingScript(true);
      let newProjectId = selectedProjectId;

      // Only create project if not already selected (when selecting project without script)
      if (!newProjectId) {
        if (!projectName) {
          toast({ title: 'Project name missing', description: 'Please create a project first.', variant: 'destructive' });
          setGeneratingScript(false);
          return;
        }

        const createRes = await createProject({
          userId,
          actorId: selectedActorId,
          projectName: projectName,
        });

        const newProject = createRes?.data;
        newProjectId = newProject?.id;
        if (!newProjectId) {
          throw new Error('Project ID not returned from API');
        }

        addProject(newProject);
        setSelectedProjectId(newProjectId);
        toast({ title: 'Project created', description: 'Generating script...' });
      } else {
        toast({ title: 'Generating script...', description: 'Please wait while we process your project.' });
      }

      const res = await generateScript({ projectId: newProjectId, prompt });
      setGeneratingScript(false);
      
      const scenes = res?.data ?? res?.scenes ?? res ?? [];
      const frames = (scenes || []).map((scene, idx) => ({
        id: scene.id || `scene-${idx}`,
        scene: scene.scene || `Scene ${scene.sequenceOrder ?? idx + 1}`,
        scriptText: scene.scriptText || scene.aiPrompt || 'No description',
        sketchUrl: scene.sketchUrl || null,
        status: scene.status || 'pending',
        sequenceOrder: scene.sequenceOrder ?? idx + 1,
        isLocked: false,
      }));
      setFrames(frames);
      onFramesReady?.(frames);
      toast({ title: 'Script generated', description: 'Now generate storyboard sketches from Storyboard section.' });
    } catch (error) {
      setGeneratingScript(false);
      toast({ title: 'Generation failed', description: error?.message || 'Could not generate script.', variant: 'destructive' });
    }
  };

  return (
    <section ref={sectionRef} className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">UPLOAD YOUR SCRIPT</h2>
      </div>

      <Card className="script-card">
        <CardContent className="script-content">
          <div className="script-upload-area">
            <div className="paste-script">
              <p>Paste your script directly:</p>
              <Textarea
                placeholder="Enter your script here..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="script-textarea"
                rows={10}
              />
            </div>
          </div>

          <div className="script-actions">
            <Button
              className="generate-storyboard-btn"
              onClick={handleGenerateScript}
              disabled={creatingProject || generatingScript}
            >
              {(creatingProject || generatingScript) ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {buttonLabel}
                </>
              ) : (
                buttonLabel
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

