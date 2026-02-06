import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { User } from 'lucide-react';
import { useGetActorById } from '../../services/actor.service';
import { FrameCard } from '../Dashboard/components/StoryboardSection/FrameCard';

function ActorImage({ actorId }) {
  const { data: actor } = useGetActorById(actorId);
  const fallbackImage = "https://i.pinimg.com/736x/3d/70/41/3d704151eebcdb14b129c0fead905fbb.jpg";
  const actorImage = actor?.avatarUrl || fallbackImage;

  return (
    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
      {actorImage ? (
        <img src={actorImage} alt="Actor" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="w-8 h-8 text-gray-600" />
        </div>
      )}
    </div>
  );
}

export function ProjectCard({ 
  project, 
  scenes = [],
  onViewDetails
}) {
  return (
    <>
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg">
        <CardContent className="p-6">
          {/* Project Header */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4 flex-1">
                <ActorImage actorId={project.actorId} />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{project.
projectName || 'Untitled Project'}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-orange-500 text-orange-500 bg-orange-500/10">
                      {project.status || 'unknown'}
                    </Badge>
                    {scenes.length > 0 && (
                      <Badge variant="outline" className="border-blue-500 text-blue-500 bg-blue-500/10">
                        {scenes.length} scenes
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onViewDetails?.(project.id)}
                className="min-w-[180px] font-semibold transition-all bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
              >
                <span className="text-sm">View Details</span>
              </Button>
            </div>
          </div>

          {/* Script Text */}
          {project.scriptText && (
            <div className="bg-gray-950/50 rounded-lg border border-gray-800 p-4">
              <p className="text-sm text-gray-300 line-clamp-3">
                {project.scriptText}
              </p>
            </div>
          )}

          {!project.scriptText && (
            <div className="bg-gray-950/50 rounded-lg border border-dashed border-gray-700 p-4 text-center">
              <p className="text-sm text-gray-400">No script added yet. Click "Generate Script" to add one.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scenes Results - Shown below the project card */}
      {scenes.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-4 gap-3">
            {scenes.map((scene, idx) => {
              // Convert project scene format to frame format for FrameCard
              const frameData = {
                id: scene.id || idx,
                sequenceOrder: scene.sequenceOrder || idx + 1,
                scriptText: scene.scriptText || scene.aiPrompt || 'No description',
                sketchUrl: scene.sketchUrl || null,
                finalImageUrl: scene.finalImageUrl || null,
                aiPrompt: scene.aiPrompt || null,
                status: scene.status || 'pending',
                scene: `Scene ${scene.sequenceOrder || idx + 1}`,
              };

              return (
                <FrameCard
                  key={frameData.id}
                  frame={frameData}
                  isGeneratingSketches={false}
                  isGeneratingImages={false}
                  setSelectedFrame={() => {}} // No-op for MyProjects
                  setRegenerateFrame={() => {}} // No-op for MyProjects
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
